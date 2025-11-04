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
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAppointments, usePets } from '@/hooks';
import { mockFacilities } from '@/data/mockFacilities';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Button, Card, Loading } from '@/components/ui';
import { FormDatePicker } from '@/components/forms';

export default function RescheduleAppointmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { appointments, rescheduleAppointment, isLoading } = useAppointments();
  const { pets } = usePets();
  
  const [appointment, setAppointment] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [availableTimeSlots] = useState([
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ]);

  useEffect(() => {
    if (id && appointments.length > 0) {
      const found = appointments.find(a => a.appointmentId === id);
      if (found) {
        setAppointment(found);
        const appointmentDate = new Date(found.dateTime);
        setSelectedDate(appointmentDate);
        const timeStr = appointmentDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        setSelectedTime(timeStr);
      }
    }
  }, [id, appointments]);

  const pet = appointment ? pets.find(p => p.petId === appointment.petId) : null;
  const facility = appointment ? mockFacilities.find(f => f.facilityId === appointment.facilityId) : null;

  const handleReschedule = async () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    try {
      setSubmitting(true);

      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const result = await rescheduleAppointment(id!, dateTime.toISOString());

      if (result.success) {
        Alert.alert(
          'Appointment Rescheduled!',
          `Your appointment has been rescheduled to ${dateTime.toLocaleDateString()} at ${selectedTime}.`,
          [
            {
              text: 'View Appointment',
              onPress: () => {
                router.replace(`/appointment/${id}`);
              },
            },
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      Alert.alert('Error', 'Failed to reschedule appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !appointment || !pet || !facility) {
    return <Loading fullScreen text="Loading appointment details..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ title: 'Reschedule Appointment' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Current Appointment Info */}
        <Card variant="elevated" padding="md" style={styles.section}>
          <Text style={styles.sectionTitle}>Current Appointment</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>
                {new Date(appointment.dateTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.infoValue}>
                {new Date(appointment.dateTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="paw" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Pet</Text>
              <Text style={styles.infoValue}>{pet.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Facility</Text>
              <Text style={styles.infoValue}>{facility.name}</Text>
            </View>
          </View>
        </Card>

        {/* New Date Selection */}
        <Card variant="elevated" padding="md" style={styles.section}>
          <Text style={styles.sectionTitle}>Select New Date</Text>
          <FormDatePicker
            label="Date"
            value={selectedDate}
            onChange={setSelectedDate}
            minimumDate={new Date()}
          />
        </Card>

        {/* Time Slot Selection */}
        <Card variant="elevated" padding="md" style={styles.section}>
          <Text style={styles.sectionTitle}>Select New Time</Text>
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

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Reschedule Appointment"
            onPress={handleReschedule}
            disabled={!selectedTime || submitting}
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
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
  content: {
    padding: Sizes.spacing.lg,
  },
  section: {
    marginBottom: Sizes.spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Sizes.spacing.md,
    paddingBottom: Sizes.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoContent: {
    flex: 1,
    marginLeft: Sizes.spacing.sm,
  },
  infoLabel: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  infoValue: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
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
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  actions: {
    marginTop: Sizes.spacing.lg,
    gap: Sizes.spacing.md,
  },
  actionButton: {
    marginBottom: 0,
  },
});
