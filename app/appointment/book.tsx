import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePets } from '../../hooks';
import { useAuth } from '../../hooks';
import { appointmentService } from '../../services/appointment.service';
import { mockFacilities } from '../../data/mockFacilities';
import { Facility, Pet, AppointmentType, Species } from '../../types';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Button, Card } from '../../components/ui';
import { FormCheckbox, FormSelect, FormDatePicker, FormField } from '../../components/forms';

export default function BookAppointmentScreen() {
  const { petId, facilityId } = useLocalSearchParams<{ petId?: string; facilityId?: string }>();
  const router = useRouter();
  const { pets, isLoading: petsLoading } = usePets();
  const { user } = useAuth();
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(AppointmentType.ROUTINE);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-appointment checklist
  const [checklist, setChecklist] = useState({
    feedPetFullMeal: false,
    ensureHydration: false,
    bringVaccinationRecords: false,
    bringMedicationsList: false,
    noteHealthChanges: false,
  });

  const [availableTimeSlots] = useState([
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ]);

  useEffect(() => {
    if (facilityId) {
      const facility = mockFacilities.find(f => f.facilityId === facilityId);
      setSelectedFacility(facility || null);
    }
  }, [facilityId]);

  useEffect(() => {
    if (petId && !petsLoading && pets.length > 0) {
      const pet = pets.find(p => p.petId === petId);
      setSelectedPet(pet || null);
    }
  }, [petId, petsLoading, pets]);

  const eligiblePets = pets.filter(pet => pet.eligibilityStatus === 'ELIGIBLE');

  const handleSubmit = async () => {
    if (!selectedPet) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    if (!selectedFacility) {
      Alert.alert('Error', 'Please select a facility');
      return;
    }

    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    // Validate checklist
    const allChecked = Object.values(checklist).every(v => v);
    if (!allChecked) {
      Alert.alert(
        'Pre-Appointment Checklist',
        'Please confirm all pre-appointment requirements before booking.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue Anyway', onPress: () => proceedWithBooking() }
        ]
      );
      return;
    }

    await proceedWithBooking();
  };

  const proceedWithBooking = async () => {
    try {
      setSubmitting(true);

      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointment = await appointmentService.bookAppointment({
        petId: selectedPet!.petId,
        facilityId: selectedFacility!.facilityId,
        dateTime: dateTime.toISOString(),
        type: appointmentType,
        specialInstructions,
      });

      Alert.alert(
        'Appointment Booked!',
        `Your appointment has been scheduled for ${dateTime.toLocaleDateString()} at ${selectedTime}.`,
        [
          {
            text: 'View Appointments',
            onPress: () => {
              router.replace('/tabs/appointments');
            },
          },
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFacilityChange = () => {
    router.push('/appointment/facilities');
  };

  if (petsLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (eligiblePets.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={['top']}>
        <View style={styles.emptyContent}>
          <MaterialIcons name="pets" size={64} color={Colors.textSecondary} style={styles.emptyIconStyle} />
          <Text style={styles.emptyTitle}>No Eligible Pets</Text>
          <Text style={styles.emptyText}>
            You don't have any pets that are currently eligible for blood donation.
            Please complete the eligibility questionnaire for your pets first.
          </Text>
          <Button
            title="Go to My Pets"
            onPress={() => router.push('/tabs/pets')}
            style={styles.emptyButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Book Appointment</Text>
          <Text style={styles.subtitle}>Schedule a blood donation appointment</Text>
        </View>

        {/* Pet Selection */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="pets" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Select Pet</Text>
          </View>
          <FormSelect
            label="Pet"
            value={selectedPet?.petId || ''}
            onSelect={(value) => {
              const pet = pets.find(p => p.petId === value);
              setSelectedPet(pet || null);
            }}
            options={eligiblePets.map(pet => ({
              label: `${pet.name} (${pet.species})`,
              value: pet.petId,
            }))}
            placeholder="Choose a pet"
          />
          {selectedPet && (
            <View style={styles.petInfo}>
              <Text style={styles.petInfoText}>
                {selectedPet.breed} • {selectedPet.currentWeight} lbs
              </Text>
            </View>
          )}
        </Card>

        {/* Facility Selection */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-hospital" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Facility</Text>
          </View>
          {selectedFacility ? (
            <View style={styles.facilityInfo}>
              <Text style={styles.facilityName}>{selectedFacility.name}</Text>
              <Text style={styles.facilityAddress}>
                {selectedFacility.address.street}, {selectedFacility.address.city}
              </Text>
              <Button
                title="Change Facility"
                onPress={handleFacilityChange}
                variant="outline"
                size="sm"
                style={styles.changeFacilityButton}
              />
            </View>
          ) : (
            <Button
              title="Select Facility"
              onPress={handleFacilityChange}
              variant="outline"
            />
          )}
        </Card>

        {/* Date & Time Selection */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="event" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Date & Time</Text>
          </View>
          
          <FormDatePicker
            label="Appointment Date"
            value={selectedDate}
            onChange={setSelectedDate}
            minimumDate={new Date()}
          />

          <Text style={styles.timeLabel}>Select Time Slot</Text>
          <View style={styles.timeSlots}>
            {availableTimeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Appointment Type */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="category" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Appointment Type</Text>
          </View>
          <FormSelect
            label="Type"
            value={appointmentType}
            onSelect={(value) => setAppointmentType(value as AppointmentType)}
            options={[
              { label: 'Routine Donation', value: AppointmentType.ROUTINE },
              { label: 'Emergency Donation', value: AppointmentType.EMERGENCY },
              { label: 'Screening Only', value: AppointmentType.SCREENING },
              { label: 'Follow-up', value: AppointmentType.FOLLOWUP },
            ]}
          />
        </Card>

        {/* Pre-Appointment Checklist */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="checklist" size={20} color={Colors.success} />
            <Text style={styles.sectionTitle}>Pre-Appointment Checklist</Text>
          </View>
          <Text style={styles.checklistDescription}>
            Please confirm the following before your appointment:
          </Text>

          <FormCheckbox
            label="Feed your pet a full meal 2-3 hours before the appointment"
            value={checklist.feedPetFullMeal}
            onChange={(value) =>
              setChecklist({ ...checklist, feedPetFullMeal: value })
            }
          />

          <FormCheckbox
            label="Ensure your pet is well-hydrated"
            value={checklist.ensureHydration}
            onChange={(value) =>
              setChecklist({ ...checklist, ensureHydration: value })
            }
          />

          <FormCheckbox
            label="Bring vaccination records"
            value={checklist.bringVaccinationRecords}
            onChange={(value) =>
              setChecklist({ ...checklist, bringVaccinationRecords: value })
            }
          />

          <FormCheckbox
            label="Bring current medications list"
            value={checklist.bringMedicationsList}
            onChange={(value) =>
              setChecklist({ ...checklist, bringMedicationsList: value })
            }
          />

          <FormCheckbox
            label="Note any recent health changes"
            value={checklist.noteHealthChanges}
            onChange={(value) =>
              setChecklist({ ...checklist, noteHealthChanges: value })
            }
          />
        </Card>

        {/* Special Instructions */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="notes" size={20} color={Colors.info} />
            <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          </View>
          <FormField>
            <Text style={styles.instructionsInput}>
              {specialInstructions || 'Add any special notes or requests...'}
            </Text>
          </FormField>
        </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.footerButton}
          />
          <Button
            title={submitting ? 'Booking...' : 'Book Appointment'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || !selectedPet || !selectedFacility || !selectedTime}
            style={styles.footerButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.spacing.xl,
    backgroundColor: Colors.background,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIconStyle: {
    marginBottom: Sizes.spacing.lg,
    opacity: 0.3,
  },
  emptyTitle: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Sizes.spacing.lg,
    lineHeight: 20,
  },
  emptyButton: {
    minWidth: 150,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Sizes.spacing.lg,
    paddingBottom: 120,
  },
  header: {
    marginBottom: Sizes.spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.xs,
    marginBottom: Sizes.spacing.md,
    marginTop: Sizes.spacing.sm,
  },
  backText: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  title: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  subtitle: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Sizes.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
    marginBottom: Sizes.spacing.md,
  },
  sectionTitle: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  petInfo: {
    marginTop: Sizes.spacing.sm,
    padding: Sizes.spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Sizes.borderRadius.md,
  },
  petInfoText: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  facilityInfo: {
    padding: Sizes.spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Sizes.borderRadius.md,
  },
  facilityName: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  facilityAddress: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.md,
  },
  changeFacilityButton: {
    alignSelf: 'flex-start',
  },
  timeLabel: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
    marginTop: Sizes.spacing.md,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 70,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotText: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  timeSlotTextSelected: {
    fontFamily: 'SourceSans3_700Bold',
    color: Colors.white,
  },
  checklistDescription: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.md,
    lineHeight: 20,
  },
  instructionsInput: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    padding: Sizes.spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Sizes.borderRadius.md,
    minHeight: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Sizes.spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Sizes.spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
