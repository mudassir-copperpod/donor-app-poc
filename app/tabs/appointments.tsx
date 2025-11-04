import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { useAppointments, usePets } from '../../hooks';
import { Card, Badge, EmptyState, Button, Loading } from '../../components/ui';
import { AppointmentCard } from '../../components/appointment';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { appointments, isLoading, loadAppointments, cancelAppointment } = useAppointments();
  const { pets } = usePets();

  // Refresh appointments when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [loadAppointments])
  );

  const upcomingAppointments = appointments.filter(a => 
    a.status === 'SCHEDULED' || a.status === 'CONFIRMED'
  );

  const pastAppointments = appointments.filter(a => 
    a.status === 'COMPLETED' || a.status === 'CANCELLED'
  );

  const handleReschedule = (appointmentId: string) => {
    router.push(`/appointment/reschedule/${appointmentId}`);
  };

  const handleCancel = (appointmentId: string, petName?: string) => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel this appointment${petName ? ` for ${petName}` : ''}?`,
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelAppointment(appointmentId, 'Cancelled by user');
            if (result.success) {
              Alert.alert('Success', 'Appointment cancelled successfully');
            } else {
              Alert.alert('Error', result.error || 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const renderAppointment = ({ item }: { item: any }) => {
    const pet = pets.find(p => p.petId === item.petId);
    const isUpcoming = item.status === 'SCHEDULED' || item.status === 'CONFIRMED';
    
    return (
      <View style={styles.appointmentWrapper}>
        <AppointmentCard 
          appointment={item} 
          petName={pet?.name}
          onPress={() => router.push(`/appointment/${item.appointmentId}`)}
          onReschedule={isUpcoming ? () => handleReschedule(item.appointmentId) : undefined}
          onCancel={isUpcoming ? () => handleCancel(item.appointmentId, pet?.name) : undefined}
          showActions={isUpcoming}
        />
      </View>
    );
  };

  if (isLoading && appointments.length === 0) {
    return <Loading fullScreen text="Loading appointments..." />;
  }

  if (appointments.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.emptyContainer}>
            <Card style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={64} color={Colors.textSecondary} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No Appointments</Text>
              <Text style={styles.emptyDescription}>
                You haven't booked any appointments yet. Book your first appointment to start saving lives!
              </Text>
              <Button
                title="Book Appointment"
                onPress={() => router.push('/appointment/book')}
                style={styles.emptyButton}
              />
            </Card>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <FlatList
          data={[...upcomingAppointments, ...pastAppointments]}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.appointmentId}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadAppointments}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <View style={styles.headerTop}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>My Appointments</Text>
                    <Text style={styles.subtitle}>
                      {appointments.length} total appointments
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => router.push('/appointment/book')}
                  >
                    <Ionicons name="add" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                
                {/* Quick Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.miniStat}>
                    <Ionicons name="time-outline" size={20} color={Colors.info} />
                    <Text style={styles.miniStatValue}>{upcomingAppointments.length}</Text>
                    <Text style={styles.miniStatLabel}>Upcoming</Text>
                  </View>
                  <View style={styles.miniStat}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                    <Text style={styles.miniStatValue}>{appointments.filter(a => a.status === 'COMPLETED').length}</Text>
                    <Text style={styles.miniStatLabel}>Completed</Text>
                  </View>
                  <View style={styles.miniStat}>
                    <Ionicons name="close-circle" size={20} color={Colors.error} />
                    <Text style={styles.miniStatValue}>{appointments.filter(a => a.status === 'CANCELLED').length}</Text>
                    <Text style={styles.miniStatLabel}>Cancelled</Text>
                  </View>
                </View>
              </View>

              {upcomingAppointments.length > 0 && (
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar" size={18} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Upcoming</Text>
                </View>
              )}
            </>
          }
        />
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
  list: {
    paddingHorizontal: 0,
    paddingBottom: Sizes.spacing.xxl,
  },
  appointmentWrapper: {
    paddingHorizontal: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.md,
  },
  header: {
    paddingHorizontal: Sizes.spacing.lg,
    paddingTop: Sizes.spacing.md,
    paddingBottom: Sizes.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizes.spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  statsRow: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
    marginTop: Sizes.spacing.sm,
  },
  miniStat: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniStatValue: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginTop: 4,
  },
  miniStatLabel: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.xs,
    paddingHorizontal: Sizes.spacing.lg,
    paddingVertical: Sizes.spacing.sm,
    marginTop: Sizes.spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Sizes.spacing.lg,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Sizes.spacing.xxl,
  },
  emptyIcon: {
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
  emptyDescription: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Sizes.spacing.lg,
    lineHeight: 20,
  },
  emptyButton: {
    minWidth: 200,
  },
});
