import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Facility, Species } from '../../types';
import { mockFacilities } from '../../data/mockFacilities';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Button, Badge, Card, Input } from '../../components/ui';
import { FacilityCard } from '../../components/appointment';

export default function FacilitiesScreen() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | 'ALL'>('ALL');
  const [selectedInventory, setSelectedInventory] = useState<string>('ALL');
  const [zipCodeSearch, setZipCodeSearch] = useState('');

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedSpecies, selectedInventory, facilities]);

  // Debounced zipcode search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timer);
  }, [zipCodeSearch]);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFacilities(mockFacilities);
      setFilteredFacilities(mockFacilities);
    } catch (error) {
      console.error('Error loading facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...facilities];

    // Filter by zipcode
    if (zipCodeSearch.trim()) {
      filtered = filtered.filter((facility) =>
        facility.address.postalCode.includes(zipCodeSearch.trim())
      );
    }

    // Filter by species
    if (selectedSpecies !== 'ALL') {
      filtered = filtered.filter((facility) =>
        facility.capabilities.speciesAccepted.includes(selectedSpecies as Species)
      );
    }

    // Filter by inventory status
    if (selectedInventory !== 'ALL') {
      filtered = filtered.filter(
        (facility) => facility.inventoryStatus === selectedInventory
      );
    }

    setFilteredFacilities(filtered);
  };

  const handleFacilitySelect = (facility: Facility) => {
    router.push({
      pathname: '/appointment/book',
      params: { facilityId: facility.facilityId },
    });
  };

  const getInventoryColor = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return Colors.error;
      case 'LOW':
        return Colors.warning;
      case 'ADEQUATE':
        return Colors.info;
      case 'GOOD':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Find a Facility</Text>
      <Text style={styles.subtitle}>
        {filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'} available
      </Text>

      {/* Zipcode Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchHeader}>
          <MaterialIcons name="location-on" size={18} color={Colors.primary} />
          <Text style={styles.searchLabel}>Search by Zip Code</Text>
        </View>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <Input
            placeholder="Enter zip code"
            value={zipCodeSearch}
            onChangeText={setZipCodeSearch}
            keyboardType="numeric"
            maxLength={5}
            containerStyle={styles.searchInput}
          />
          {zipCodeSearch.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setZipCodeSearch('')}
            >
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Species Filter */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <MaterialIcons name="pets" size={18} color={Colors.primary} />
          <Text style={styles.filterLabel}>Species Accepted</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === 'ALL' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies('ALL')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === 'ALL' && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.DOG && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.DOG)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.DOG && styles.filterButtonTextActive,
              ]}
            >
              Dogs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.CAT && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.CAT)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.CAT && styles.filterButtonTextActive,
              ]}
            >
              Cats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.HORSE && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.HORSE)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.HORSE && styles.filterButtonTextActive,
              ]}
            >
              Horses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.RABBIT && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.RABBIT)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.RABBIT && styles.filterButtonTextActive,
              ]}
            >
              Rabbits
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.FERRET && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.FERRET)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.FERRET && styles.filterButtonTextActive,
              ]}
            >
              Ferrets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.GOAT && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.GOAT)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.GOAT && styles.filterButtonTextActive,
              ]}
            >
              Goats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.SHEEP && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.SHEEP)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.SHEEP && styles.filterButtonTextActive,
              ]}
            >
              Sheep
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.PIG && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.PIG)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.PIG && styles.filterButtonTextActive,
              ]}
            >
              Pigs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.COW && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.COW)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.COW && styles.filterButtonTextActive,
              ]}
            >
              Cows
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.LLAMA && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.LLAMA)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.LLAMA && styles.filterButtonTextActive,
              ]}
            >
              Llamas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedSpecies === Species.ALPACA && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedSpecies(Species.ALPACA)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedSpecies === Species.ALPACA && styles.filterButtonTextActive,
              ]}
            >
              Alpacas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Inventory Filter */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <Ionicons name="water" size={18} color={Colors.error} />
          <Text style={styles.filterLabel}>Blood Inventory Status</Text>
        </View>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedInventory === 'ALL' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedInventory('ALL')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedInventory === 'ALL' && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedInventory === 'CRITICAL' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedInventory('CRITICAL')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedInventory === 'CRITICAL' && styles.filterButtonTextActive,
              ]}
            >
              Critical
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedInventory === 'LOW' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedInventory('LOW')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedInventory === 'LOW' && styles.filterButtonTextActive,
              ]}
            >
              Low
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFacility = ({ item }: { item: Facility }) => (
    <View style={styles.facilityCardWrapper}>
      <TouchableOpacity
        onPress={() => handleFacilitySelect(item)}
        activeOpacity={0.7}
      >
        <FacilityCard facility={item} />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="location-off" size={64} color={Colors.textSecondary} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No Facilities Found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters to see more facilities.
      </Text>
      <Button
        title="Clear All Filters"
        onPress={() => {
          setSelectedSpecies('ALL');
          setSelectedInventory('ALL');
          setZipCodeSearch('');
        }}
        variant="outline"
        style={styles.clearFiltersButton}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
      <FlatList
        data={filteredFacilities}
        renderItem={renderFacility}
        keyExtractor={(item) => item.facilityId}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: Sizes.spacing.xxl,
  },
  facilityCardWrapper: {
    paddingHorizontal: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.md,
  },
  header: {
    paddingHorizontal: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.lg,
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
    marginBottom: Sizes.spacing.md,
  },
  searchSection: {
    marginBottom: Sizes.spacing.lg,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.xs,
    marginBottom: Sizes.spacing.sm,
  },
  searchLabel: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  searchInputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: Sizes.spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
    paddingLeft: 40,
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: Sizes.spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  filterSection: {
    marginBottom: Sizes.spacing.lg,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.xs,
    marginBottom: Sizes.spacing.sm,
  },
  filterLabel: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  filterScrollContent: {
    gap: Sizes.spacing.sm,
    paddingRight: Sizes.spacing.lg,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Sizes.spacing.lg,
    paddingVertical: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.full,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  filterButtonTextActive: {
    fontFamily: 'SourceSans3_700Bold',
    color: Colors.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.spacing.xxxl,
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
  },
  emptyText: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Sizes.spacing.lg,
    paddingHorizontal: Sizes.spacing.xl,
    lineHeight: 20,
  },
  clearFiltersButton: {
    minWidth: 150,
  },
});
