import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PetAvatar } from '@/components/pet/PetAvatar';
import { EligibilityBadge } from '@/components/pet/EligibilityBadge';
import { Loading } from '@/components/ui/Loading';
import { usePets } from '@/hooks/usePets';
import { useAppointments } from '@/hooks/useAppointments';
import { DonationService } from '@/services/donation.service';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';

export default function PetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedPet, getPetById, deletePet, isLoading } = usePets();
  const { appointments } = useAppointments();
  const [nextDonationDate, setNextDonationDate] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getPetById(id);
      loadNextDonationDate();
    }
  }, [id]);

  const loadNextDonationDate = async () => {
    if (id) {
      const date = await DonationService.getNextDonationDate(id);
      setNextDonationDate(date);
    }
  };

  const handleEdit = () => {
    router.push(`/pet/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to remove ${selectedPet?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await deletePet(id);
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleBookAppointment = () => {
    router.push(`/appointment/book?petId=${id}`);
  };

  const handleViewHistory = () => {
    router.push(`/pet/donations/${id}`);
  };

  if (isLoading || !selectedPet) {
    return <Loading fullScreen text="Loading pet details..." />;
  }

  const calculateAge = () => {
    const birthDate = new Date(selectedPet.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Pet Info Card */}
      <Card variant="elevated" padding="lg" style={styles.mainCard}>
        <View style={styles.petHeader}>
          <PetAvatar
            photoUrl={selectedPet.photoUrl}
            species={selectedPet.species}
            size="xl"
          />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{selectedPet.name}</Text>
            <Text style={styles.petBreed}>{selectedPet.breed}</Text>
            <EligibilityBadge status={selectedPet.eligibilityStatus} size="md" />
          </View>
        </View>

        {selectedPet.eligibilityNotes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Eligibility Notes:</Text>
            <Text style={styles.notesText}>{selectedPet.eligibilityNotes}</Text>
          </View>
        )}

        {nextDonationDate && selectedPet.eligibilityStatus === 'ELIGIBLE' && (
          <View style={styles.nextDonationContainer}>
            <Text style={styles.nextDonationLabel}>Next Eligible Donation:</Text>
            <Text style={styles.nextDonationDate}>
              {new Date(nextDonationDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        )}
      </Card>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        {selectedPet.eligibilityStatus === 'ELIGIBLE' && (
          <Button
            title="📅 Book Appointment"
            onPress={handleBookAppointment}
            fullWidth
            style={styles.actionButton}
          />
        )}
        <Button
          title="📊 View Donation History"
          onPress={handleViewHistory}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
      </View>

      {/* Recent Appointments */}
      {appointments.filter(a => a.petId === id).length > 0 && (
        <Card variant="elevated" padding="md" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Recent Appointments</Text>
          </View>
          {appointments
            .filter(a => a.petId === id)
            .slice(0, 3)
            .map((appointment) => (
              <TouchableOpacity
                key={appointment.appointmentId}
                style={styles.appointmentItem}
                onPress={() => router.push(`/appointment/${appointment.appointmentId}`)}
              >
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentDate}>
                    {new Date(appointment.dateTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.appointmentType}>{appointment.type}</Text>
                </View>
                <Badge
                  label={appointment.status}
                  variant={
                    appointment.status === 'COMPLETED'
                      ? 'success'
                      : appointment.status === 'CANCELLED'
                      ? 'error'
                      : 'info'
                  }
                  size="sm"
                />
              </TouchableOpacity>
            ))}
          {appointments.filter(a => a.petId === id).length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/tabs/appointments')}
            >
              <Text style={styles.viewAllText}>View All Appointments →</Text>
            </TouchableOpacity>
          )}
        </Card>
      )}

      {/* Health Metrics */}
      <Card variant="elevated" padding="md" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="heart" size={20} color={Colors.error} />
          <Text style={styles.sectionTitle}>Health Metrics</Text>
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="scale-outline" size={28} color={Colors.primary} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>Weight</Text>
              <Text style={styles.metricValue}>{selectedPet.currentWeight} lbs</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="water-outline" size={28} color={Colors.error} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>Blood Type</Text>
              <Text style={styles.metricValue}>{selectedPet.bloodType.replace(/_/g, ' ')}</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="calendar-outline" size={28} color={Colors.info} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>Age</Text>
              <Text style={styles.metricValue}>{calculateAge()} years old</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Basic Information */}
      <Card variant="elevated" padding="md" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="paw" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Basic Information</Text>
        </View>
        
        <InfoRow label="Species" value={selectedPet.species} />
        <InfoRow label="Breed" value={selectedPet.breed} />
        <InfoRow label="Sex" value={selectedPet.sex.replace('_', ' ')} />
        <InfoRow label="Color" value={selectedPet.color} />
        {selectedPet.markings && <InfoRow label="Markings" value={selectedPet.markings} />}
        {selectedPet.microchipNumber && (
          <InfoRow label="Microchip" value={selectedPet.microchipNumber} />
        )}
      </Card>

      {/* Veterinarian Information */}
      <Card variant="elevated" padding="md" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medical" size={20} color={Colors.success} />
          <Text style={styles.sectionTitle}>Veterinarian</Text>
        </View>
        
        <InfoRow label="Veterinarian" value={selectedPet.veterinarianInfo.veterinarianName} />
        <InfoRow label="Clinic" value={selectedPet.veterinarianInfo.clinicName} />
        <InfoRow label="Phone" value={selectedPet.veterinarianInfo.clinicPhone} />
        <InfoRow label="Email" value={selectedPet.veterinarianInfo.clinicEmail} />
      </Card>

      {/* Eligibility Information */}
      {selectedPet.nextReviewDate && (
        <Card variant="elevated" padding="md" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.sectionTitle}>Eligibility</Text>
          </View>
          
          <InfoRow
            label="Next Review Date"
            value={new Date(selectedPet.nextReviewDate).toLocaleDateString()}
          />
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.bottomActions}>
        <Button
          title="Edit Pet"
          onPress={handleEdit}
          variant="secondary"
          fullWidth
          style={styles.bottomButton}
        />
        <Button
          title="Delete Pet"
          onPress={handleDelete}
          variant="danger"
          fullWidth
          style={styles.bottomButton}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  header: {
    marginBottom: Sizes.spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  mainCard: {
    marginBottom: Sizes.spacing.md,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.spacing.md,
  },
  petInfo: {
    flex: 1,
    marginLeft: Sizes.spacing.lg,
  },
  petName: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  petBreed: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.sm,
  },
  notesContainer: {
    backgroundColor: Colors.warningLight + '30',
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
  },
  notesLabel: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.warningDark,
    marginBottom: Sizes.spacing.xs,
  },
  notesText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    lineHeight: Sizes.fontSize.sm * Sizes.lineHeight.relaxed,
  },
  actionsContainer: {
    marginBottom: Sizes.spacing.md,
  },
  actionButton: {
    marginBottom: Sizes.spacing.sm,
  },
  section: {
    marginBottom: Sizes.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.xs,
    marginBottom: Sizes.spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  metricsContainer: {
    gap: Sizes.spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricIconContainer: {
    width: 50,
    height: 50,
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.spacing.md,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  metricValue: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Sizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  appointmentType: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.textSecondary,
  },
  viewAllButton: {
    paddingVertical: Sizes.spacing.sm,
    alignItems: 'center',
    marginTop: Sizes.spacing.xs,
  },
  viewAllText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: Sizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    width: 120,
  },
  infoValue: {
    flex: 1,
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  bottomActions: {
    gap: Sizes.spacing.sm,
    marginTop: Sizes.spacing.md,
    marginBottom: Sizes.spacing.xl,
  },
  bottomButton: {
    marginBottom: 0,
  },
  nextDonationContainer: {
    marginTop: Sizes.spacing.md,
    padding: Sizes.spacing.md,
    backgroundColor: Colors.successLight + '30',
    borderRadius: Sizes.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  nextDonationLabel: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.successDark,
    marginBottom: Sizes.spacing.xs,
  },
  nextDonationDate: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.success,
  },
});
