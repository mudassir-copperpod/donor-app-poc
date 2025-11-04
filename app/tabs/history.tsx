import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { useDonations, usePets } from '../../hooks';
import { Card, EmptyState, Button, Loading } from '../../components/ui';
import { DonationCard, DonationStats } from '../../components/donation';

export default function HistoryScreen() {
  const router = useRouter();
  const { donations, stats, isLoading, loadDonations } = useDonations();
  const { pets } = usePets();

  // Refresh donations when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDonations();
    }, [loadDonations])
  );

  const renderDonation = ({ item }: { item: any }) => {
    const pet = pets.find(p => p.petId === item.petId);
    
    return (
      <View style={styles.donationWrapper}>
        <DonationCard 
          donation={item} 
          petName={pet?.name}
          onPress={() => router.push(`/donation/${item.donationId}`)}
        />
      </View>
    );
  };

  if (isLoading && donations.length === 0) {
    return <Loading fullScreen text="Loading donation history..." />;
  }

  if (donations.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.emptyContainer}>
            <Card style={styles.emptyCard}>
              <Ionicons name="water" size={64} color={Colors.textSecondary} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No Donation History</Text>
              <Text style={styles.emptyDescription}>
                You haven't made any donations yet. Complete your first donation to start tracking your impact!
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
        data={donations}
        renderItem={renderDonation}
        keyExtractor={(item) => item.donationId}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDonations}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Donation History</Text>
                <Text style={styles.subtitle}>
                  {donations.length} {donations.length === 1 ? 'donation' : 'donations'} completed
                </Text>
              </View>
            </View>
            
            <View style={styles.statsCardWrapper}>
              <Card style={styles.statsCard}>
                <View style={styles.statsHeader}>
                  <Ionicons name="star" size={24} color={Colors.warning} />
                  <Text style={styles.statsTitle}>Your Impact</Text>
                </View>
                <DonationStats
                  totalDonations={stats?.totalDonations || 0}
                  totalVolume={stats?.totalVolumeCollected || 0}
                  livesSaved={stats?.livesImpacted || 0}
                />
              </Card>
            </View>

            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>All Donations</Text>
            </View>
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
  donationWrapper: {
    paddingHorizontal: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.md,
  },
  header: {
    paddingHorizontal: Sizes.spacing.lg,
    paddingTop: Sizes.spacing.md,
    paddingBottom: Sizes.spacing.md,
  },
  titleContainer: {
    marginBottom: Sizes.spacing.xs,
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
  statsCardWrapper: {
    paddingHorizontal: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.md,
  },
  statsCard: {
    backgroundColor: Colors.primaryLight + '10',
    borderColor: Colors.primary + '30',
    borderWidth: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
    marginBottom: Sizes.spacing.md,
  },
  statsTitle: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 20,
    color: Colors.text,
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
