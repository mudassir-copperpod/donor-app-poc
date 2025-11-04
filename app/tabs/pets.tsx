import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PetCard } from "@/components/pet/PetCard";
import { Loading } from "@/components/ui/Loading";
import { usePets } from "@/hooks/usePets";
import { Species, EligibilityStatus } from "@/types/pet.types";

export default function PetsScreen() {
  const router = useRouter();
  const { pets, isLoading, loadPets } = usePets();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecies, setFilterSpecies] = useState<"ALL" | Species>("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | EligibilityStatus>("ALL");

  // Refresh pets when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadPets();
    }, [loadPets])
  );

  // Filter and search pets
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecies = filterSpecies === "ALL" || pet.species === filterSpecies;
      const matchesStatus = filterStatus === "ALL" || pet.eligibilityStatus === filterStatus;

      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [pets, searchQuery, filterSpecies, filterStatus]);

  const handleAddPet = () => {
    router.push("/pet/add");
  };

  const handlePetPress = (petId: string) => {
    router.push(`/pet/${petId}`);
  };

  if (isLoading && pets.length === 0) {
    return <Loading fullScreen text="Loading your pets..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.petId}
          renderItem={({ item }) => (
            <View style={styles.petCardWrapper}>
              <PetCard pet={item} onPress={() => handlePetPress(item.petId)} showEligibility />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadPets}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <>
              {/* Header with Stats */}
              <View style={styles.headerContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.screenTitle}>My Pets</Text>
                </View>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Input
                  placeholder="Search by name or breed"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  leftIcon={<Ionicons name="search" size={20} color={Colors.textSecondary} />}
                  containerStyle={styles.searchInput}
                />
              </View>

              {/* Compact Filters */}
              <View style={styles.filtersSection}>
                {/* Species Filter */}
                <View style={styles.filterRow}>
                  <View style={styles.filterLabelContainer}>
                    <Ionicons name="paw" size={16} color={Colors.textSecondary} />
                    <Text style={styles.filterRowLabel}>Species:</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScrollView}
                    contentContainerStyle={styles.filterScrollContent}
                  >
                    <CompactFilterChip
                      label="All"
                      active={filterSpecies === "ALL"}
                      onPress={() => setFilterSpecies("ALL")}
                    />
                    <CompactFilterChip
                      label="Dogs"
                      active={filterSpecies === Species.DOG}
                      onPress={() => setFilterSpecies(Species.DOG)}
                    />
                    <CompactFilterChip
                      label="Cats"
                      active={filterSpecies === Species.CAT}
                      onPress={() => setFilterSpecies(Species.CAT)}
                    />
                    <CompactFilterChip
                      label="Horses"
                      active={filterSpecies === Species.HORSE}
                      onPress={() => setFilterSpecies(Species.HORSE)}
                    />
                    <CompactFilterChip
                      label="Rabbits"
                      active={filterSpecies === Species.RABBIT}
                      onPress={() => setFilterSpecies(Species.RABBIT)}
                    />
                    <CompactFilterChip
                      label="Ferrets"
                      active={filterSpecies === Species.FERRET}
                      onPress={() => setFilterSpecies(Species.FERRET)}
                    />
                    <CompactFilterChip
                      label="Goats"
                      active={filterSpecies === Species.GOAT}
                      onPress={() => setFilterSpecies(Species.GOAT)}
                    />
                    <CompactFilterChip
                      label="Sheep"
                      active={filterSpecies === Species.SHEEP}
                      onPress={() => setFilterSpecies(Species.SHEEP)}
                    />
                    <CompactFilterChip
                      label="Pigs"
                      active={filterSpecies === Species.PIG}
                      onPress={() => setFilterSpecies(Species.PIG)}
                    />
                    <CompactFilterChip
                      label="Cows"
                      active={filterSpecies === Species.COW}
                      onPress={() => setFilterSpecies(Species.COW)}
                    />
                    <CompactFilterChip
                      label="Llamas"
                      active={filterSpecies === Species.LLAMA}
                      onPress={() => setFilterSpecies(Species.LLAMA)}
                    />
                    <CompactFilterChip
                      label="Alpacas"
                      active={filterSpecies === Species.ALPACA}
                      onPress={() => setFilterSpecies(Species.ALPACA)}
                    />
                  </ScrollView>
                </View>

                {/* Status Filter */}
                <View style={styles.filterRow}>
                  <View style={styles.filterLabelContainer}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.filterRowLabel}>Status:</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScrollView}
                    contentContainerStyle={styles.filterScrollContent}
                  >
                    <CompactFilterChip
                      label="All"
                      active={filterStatus === "ALL"}
                      onPress={() => setFilterStatus("ALL")}
                    />
                    <CompactFilterChip
                      label="Eligible"
                      active={filterStatus === EligibilityStatus.ELIGIBLE}
                      onPress={() => setFilterStatus(EligibilityStatus.ELIGIBLE)}
                    />
                    <CompactFilterChip
                      label="Pending"
                      active={filterStatus === EligibilityStatus.PENDING_REVIEW}
                      onPress={() => setFilterStatus(EligibilityStatus.PENDING_REVIEW)}
                    />
                  </ScrollView>
                </View>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Card style={styles.emptyCard}>
                <Ionicons
                  name="paw"
                  size={64}
                  color={Colors.textSecondary}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>
                  {pets.length === 0 ? "No pets yet" : "No pets found"}
                </Text>
                <Text style={styles.emptyDescription}>
                  {pets.length === 0
                    ? "Add your first pet to get started with blood donation"
                    : "Try adjusting your search or filters"}
                </Text>
                {pets.length === 0 && (
                  <Button
                    title="Add Your First Pet"
                    onPress={handleAddPet}
                    style={styles.emptyButton}
                  />
                )}
              </Card>
            </View>
          }
        />

        {/* Floating Action Button */}
        {pets.length > 0 && (
          <TouchableOpacity style={styles.fab} onPress={handleAddPet}>
            <Ionicons name="add" size={28} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function CompactFilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.compactChip, active && styles.compactChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.compactChipText, active && styles.compactChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: Sizes.spacing.lg,
    paddingTop: Sizes.spacing.md,
  },
  titleContainer: {
    marginBottom: Sizes.spacing.md,
  },
  screenTitle: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 28,
    color: Colors.text,
  },
  screenSubtitle: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: Sizes.spacing.sm,
    marginTop: Sizes.spacing.sm,
  },
  miniStat: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniStatValue: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 18,
    color: Colors.text,
    marginTop: 4,
  },
  miniStatLabel: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Sizes.spacing.lg,
    paddingVertical: Sizes.spacing.sm,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersSection: {
    paddingHorizontal: Sizes.spacing.lg,
    paddingVertical: Sizes.spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    gap: Sizes.spacing.sm,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.spacing.xs,
    marginRight: Sizes.spacing.sm,
    minWidth: 80,
  },
  filterRowLabel: {
    fontFamily: "SourceSans3_600SemiBold",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  filterScrollView: {
    flex: 1,
  },
  filterScrollContent: {
    gap: Sizes.spacing.xs,
    paddingRight: Sizes.spacing.lg,
  },
  compactChip: {
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.xs,
    borderRadius: Sizes.borderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  compactChipText: {
    fontFamily: "SourceSans3_600SemiBold",
    fontSize: 12,
    color: Colors.text,
  },
  compactChipTextActive: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 100,
  },
  petCardWrapper: {
    paddingHorizontal: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: Sizes.spacing.xxl,
  },
  emptyCard: {
    alignItems: "center",
    padding: Sizes.spacing.xxl,
  },
  emptyIcon: {
    marginBottom: Sizes.spacing.lg,
    opacity: 0.3,
  },
  emptyTitle: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 20,
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
    textAlign: "center",
  },
  emptyDescription: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Sizes.spacing.lg,
    lineHeight: 20,
  },
  emptyButton: {
    minWidth: 200,
  },
  fab: {
    position: "absolute",
    right: Sizes.spacing.lg,
    bottom: Sizes.spacing.xxl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
});
