import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { useDonations, usePets } from '@/hooks';
import { Card, EmptyState } from '@/components/ui';
import { DonationCard, DonationStats } from '@/components/donation';
import { DonationRecord } from '@/types';

export default function PetDonationHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { donations, isLoading, loadDonations } = useDonations();
  const { pets } = usePets();
  const [petDonations, setPetDonations] = useState<DonationRecord[]>([]);

  const pet = pets.find(p => p.petId === id);

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    if (donations.length > 0 && id) {
      const filtered = donations.filter(d => d.petId === id);
      setPetDonations(filtered);
    }
  }, [donations, id]);

  const calculatePetStats = () => {
    const totalDonations = petDonations.length;
    const totalVolume = petDonations.reduce((sum, d) => sum + d.collectionDetails.volumeCollected, 0);
    const livesImpacted = Math.floor(totalVolume / 450) * 3; // Rough estimate

    return { totalDonations, totalVolume, livesImpacted };
  };

  const stats = calculatePetStats();

  const renderDonation = ({ item }: { item: DonationRecord }) => (
    <DonationCard donation={item} />
  );

  if (!pet) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Stack.Screen options={{ title: 'Pet Not Found' }} />
        <View style={styles.container}>
          <EmptyState
            icon="🐾"
            title="Pet Not Found"
            description="The pet you're looking for doesn't exist."
            actionLabel="Go Back"
            onAction={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (petDonations.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Stack.Screen options={{ title: `${pet.name}'s Donations` }} />
        <View style={styles.container}>
          <EmptyState
            icon="🩸"
            title="No Donations Yet"
            description={`${pet.name} hasn't made any donations yet. Book an appointment to start their donation journey!`}
            actionLabel="Book Appointment"
            onAction={() => router.push(`/appointment/book?petId=${id}`)}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ title: `${pet.name}'s Donations` }} />
      <View style={styles.container}>
        <FlatList
          data={petDonations}
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
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>{pet.name}'s Impact</Text>
                <Text style={styles.subtitle}>
                  {petDonations.length} {petDonations.length === 1 ? 'donation' : 'donations'}
                </Text>
              </View>
              <Card style={styles.statsCard}>
                <DonationStats
                  totalDonations={stats.totalDonations}
                  totalVolume={stats.totalVolume}
                  livesSaved={stats.livesImpacted}
                />
              </Card>
            </View>
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
    padding: Sizes.spacing.md,
  },
  header: {
    marginBottom: Sizes.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  statsCard: {
    marginBottom: Sizes.spacing.lg,
  },
});
