import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Button, Card, Badge, EmptyState, Loading } from '@/components/ui';
import { useAppointments, usePets } from '@/hooks';
import { mockFacilities } from '@/data/mockFacilities';
import { Appointment } from '@/types';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { appointments, cancelAppointment, isLoading } = useAppointments();
  const { pets } = usePets();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (id && appointments.length > 0) {
      const found = appointments.find(a => a.appointmentId === id);
      setAppointment(found || null);
    }
  }, [id, appointments]);

  const pet = appointment ? pets.find(p => p.petId === appointment.petId) : null;
  const facility = appointment ? mockFacilities.find(f => f.facilityId === appointment.facilityId) : null;

  const handleCancel = () => {
    if (!appointment) return;

    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelAppointment(appointment.appointmentId, 'Cancelled by user');
            if (result.success) {
              Alert.alert(
                'Appointment Cancelled',
                'Your appointment has been successfully cancelled.',
                [
                  { 
                    text: 'Book New Appointment', 
                    onPress: () => router.push('/appointment/book') 
                  },
                  { 
                    text: 'OK', 
                    onPress: () => router.back() 
                  }
                ]
              );
            } else {
              Alert.alert('Error', result.error || 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const handleReschedule = () => {
    if (!appointment) return;
    router.push(`/appointment/reschedule/${appointment.appointmentId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
      case 'CONFIRMED':
        return 'success';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      case 'NO_SHOW':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading || !appointment) {
    return <Loading fullScreen text="Loading appointment details..." />;
  }

  if (!pet || !facility) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Stack.Screen options={{ title: 'Appointment Not Found' }} />
        <View style={styles.container}>
          <EmptyState
            icon="📅"
            title="Appointment Not Found"
            description="The appointment you're looking for doesn't exist."
            actionLabel="Go Back"
            onAction={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const canModify = appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ title: 'Appointment Details' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <Badge
            label={appointment.status}
            variant={getStatusColor(appointment.status)}
            size="lg"
          />
        </View>

        {/* Date & Time */}
        <Card variant="elevated" padding="lg" style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <Text style={styles.dateText}>{formatDate(appointment.dateTime)}</Text>
          <Text style={styles.timeText}>{formatTime(appointment.dateTime)}</Text>
          <Text style={styles.durationText}>
            Estimated Duration: {appointment.estimatedDuration} minutes
          </Text>
        </Card>

        {/* Pet Information */}
        <Card variant="elevated" padding="md" style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Information</Text>
          <InfoRow label="Name" value={pet.name} />
          <InfoRow label="Species" value={pet.species} />
          <InfoRow label="Breed" value={pet.breed} />
          <InfoRow label="Weight" value={`${pet.currentWeight} lbs`} />
        </Card>

        {/* Facility Information */}
        <Card variant="elevated" padding="md" style={styles.section}>
          <Text style={styles.sectionTitle}>Facility</Text>
          <InfoRow label="Name" value={facility.name} />
          <InfoRow label="Address" value={`${facility.address.street}, ${facility.address.city}, ${facility.address.state}`} />
          <InfoRow label="Phone" value={facility.contactPhone} />
          <InfoRow label="Email" value={facility.contactEmail} />
        </Card>

        {/* Appointment Type */}
        <Card variant="elevated" padding="md" style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <InfoRow label="Type" value={appointment.type} />
          {appointment.specialInstructions && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsLabel}>Special Instructions:</Text>
              <Text style={styles.instructionsText}>{appointment.specialInstructions}</Text>
            </View>
          )}
        </Card>

        {/* Actions */}
        {canModify && (
          <Card variant="elevated" padding="md" style={styles.section}>
            <Text style={styles.sectionTitle}>Manage Appointment</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={handleReschedule}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Reschedule</Text>
                  <Text style={styles.actionDescription}>Change date or time</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={handleCancel}
              >
                <View style={[styles.actionIconContainer, styles.actionIconDanger]}>
                  <Ionicons name="close-circle-outline" size={24} color={Colors.error} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, styles.actionTitleDanger]}>Cancel Appointment</Text>
                  <Text style={styles.actionDescription}>Remove this appointment</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {appointment.status === 'CANCELLED' && appointment.cancellationReason && (
          <Card variant="elevated" padding="md" style={styles.section}>
            <Text style={styles.sectionTitle}>Cancellation Reason</Text>
            <Text style={styles.cancellationText}>{appointment.cancellationReason}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
  statusContainer: {
    alignItems: 'center',
    marginBottom: Sizes.spacing.lg,
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
  dateText: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  timeText: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Sizes.spacing.sm,
  },
  durationText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Sizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  instructionsContainer: {
    marginTop: Sizes.spacing.md,
    padding: Sizes.spacing.md,
    backgroundColor: Colors.gray100,
    borderRadius: Sizes.borderRadius.md,
  },
  instructionsLabel: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  instructionsText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: Sizes.spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Sizes.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.spacing.sm,
  },
  actionIconDanger: {
    backgroundColor: Colors.errorLight + '30',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  actionTitleDanger: {
    color: Colors.error,
  },
  actionDescription: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.textSecondary,
  },
  cancellationText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
