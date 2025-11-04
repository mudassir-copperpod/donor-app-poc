import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { usePets, useAuth, useAppointments, useDonations } from "../../hooks";
import { Card, Button, Badge } from "../../components/ui";
import { DonationStats } from "../../components/donation";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { pets, isLoading: petsLoading, loadPets } = usePets();
  const { appointments, isLoading: appointmentsLoading, loadAppointments } = useAppointments();
  const { donations, stats, isLoading: donationsLoading, loadDonations } = useDonations();

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.userId) {
        loadPets(user.userId);
        loadAppointments(user.userId);
        loadDonations(user.userId);
      }
    }, [user?.userId, loadPets, loadAppointments, loadDonations])
  );

  const handleRefresh = () => {
    if (user?.userId) {
      loadPets(user.userId);
      loadAppointments(user.userId);
      loadDonations(user.userId);
    }
  };

  const eligiblePets = pets.filter((p) => p.eligibilityStatus === "ELIGIBLE");
  const upcomingAppointments = appointments
    .filter((a) => a.status === "SCHEDULED" || a.status === "CONFIRMED")
    .slice(0, 3);

  const loading = petsLoading || appointmentsLoading || donationsLoading;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.fullName?.split(" ")[0] || "Donor"}!</Text>
          <View style={styles.taglineContainer}>
            <Ionicons name="water" size={16} color={Colors.error} />
            <Text style={styles.tagline}>Every donation saves lives</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push("/tabs/pets")}
            activeOpacity={0.7}
          >
            <Card style={styles.statCardInner}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="pets" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{pets.length}</Text>
              <Text style={styles.statLabel}>My Pets</Text>
              <Text style={styles.statHint}>Total registered</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push("/tabs/pets")}
            activeOpacity={0.7}
          >
            <Card style={StyleSheet.flatten([styles.statCardInner, styles.successCard])}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="check-circle" size={32} color={Colors.success} />
              </View>
              <Text style={[styles.statValue, { color: Colors.success }]}>
                {eligiblePets.length}
              </Text>
              <Text style={styles.statLabel}>Eligible</Text>
              <Text style={styles.statHint}>Ready to donate</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push("/tabs/history")}
            activeOpacity={0.7}
          >
            <Card style={StyleSheet.flatten([styles.statCardInner, styles.primaryCard])}>
              <View style={styles.statIconContainer}>
                <Ionicons name="water" size={32} color={Colors.error} />
              </View>
              <Text style={[styles.statValue, { color: Colors.primary }]}>{donations.length}</Text>
              <Text style={styles.statLabel}>Donations</Text>
              <Text style={styles.statHint}>Lives saved</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push("/tabs/appointments")}
            activeOpacity={0.7}
          >
            <Card style={StyleSheet.flatten([styles.statCardInner, styles.infoCardStyle])}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="event" size={32} color={Colors.info} />
              </View>
              <Text style={[styles.statValue, { color: Colors.info }]}>
                {upcomingAppointments.length}
              </Text>
              <Text style={styles.statLabel}>Upcoming</Text>
              <Text style={styles.statHint}>Scheduled soon</Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Helpful Info Card */}
        {pets.length === 0 && (
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="bulb" size={24} color={Colors.warning} />
              <Text style={styles.infoTitle}>Get Started</Text>
            </View>
            <Text style={styles.infoText}>
              Welcome to the Pet Blood Donor App! To begin saving lives:
            </Text>
            <View style={styles.infoSteps}>
              <Text style={styles.infoStep}>1. Add your pet's profile</Text>
              <Text style={styles.infoStep}>2. Complete eligibility questionnaire</Text>
              <Text style={styles.infoStep}>3. Book your first donation appointment</Text>
            </View>
            <Button
              title="Add Your First Pet"
              onPress={() => router.push("/pet/add")}
              style={styles.infoButton}
            />
          </Card>
        )}

        {/* Donation Impact */}
        {donations.length > 0 && stats && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Impact 🌟</Text>
              <TouchableOpacity onPress={() => router.push("/tabs/history")}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <DonationStats
              totalDonations={stats.totalDonations || 0}
              totalVolume={stats.totalVolumeCollected || 0}
              livesSaved={stats.livesImpacted || 0}
            />
            <View style={styles.impactNote}>
              <Text style={styles.impactNoteText}>
                🎉 Thank you for your contribution! Your donations have helped save lives.
              </Text>
            </View>
          </Card>
        )}

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
              <TouchableOpacity onPress={() => router.push("/tabs/appointments")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {upcomingAppointments.map((appointment) => {
              const pet = pets.find((p) => p.petId === appointment.petId);
              return (
                <TouchableOpacity
                  key={appointment.appointmentId}
                  style={styles.appointmentItem}
                  onPress={() =>
                    router.push({
                      pathname: "/appointment/[id]",
                      params: { id: appointment.appointmentId },
                    })
                  }
                >
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentPet}>{pet?.name || "Unknown Pet"}</Text>
                    <Text style={styles.appointmentDate}>
                      {new Date(appointment.dateTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Badge
                    label={appointment.status}
                    variant={appointment.status === "CONFIRMED" ? "success" : "info"}
                    size="sm"
                  />
                </TouchableOpacity>
              );
            })}
          </Card>
        )}

        {/* Quick Actions */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={StyleSheet.flatten([styles.actionButton, styles.primaryAction])}
              onPress={() => router.push("/appointment/book")}
            >
              <MaterialIcons
                name="event"
                size={40}
                color={Colors.primary}
                style={styles.actionIconStyle}
              />
              <Text style={styles.actionText}>Book Appointment</Text>
              <Text style={styles.actionHint}>Schedule donation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/tabs/pets")}>
              <MaterialIcons
                name="pets"
                size={40}
                color={Colors.text}
                style={styles.actionIconStyle}
              />
              <Text style={styles.actionText}>My Pets</Text>
              <Text style={styles.actionHint}>Manage profiles</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/appointment/facilities")}
            >
              <MaterialIcons
                name="local-hospital"
                size={40}
                color={Colors.text}
                style={styles.actionIconStyle}
              />
              <Text style={styles.actionText}>Find Facility</Text>
              <Text style={styles.actionHint}>Nearby locations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/tabs/history")}
            >
              <FontAwesome5
                name="chart-bar"
                size={36}
                color={Colors.text}
                style={styles.actionIconStyle}
              />
              <Text style={styles.actionText}>History</Text>
              <Text style={styles.actionHint}>View donations</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Call to Action */}
        {eligiblePets.length > 0 && upcomingAppointments.length === 0 && (
          <Card style={styles.ctaCard}>
            <View style={styles.ctaEmojiContainer}>
              <MaterialIcons name="favorite" size={56} color={Colors.error} />
            </View>
            <Text style={styles.ctaTitle}>Ready to Save Lives?</Text>
            <Text style={styles.ctaText}>
              You have {eligiblePets.length} eligible {eligiblePets.length === 1 ? "pet" : "pets"}.
              Book an appointment today and make a difference!
            </Text>
            <Button
              title="Book Appointment Now"
              onPress={() => router.push("/appointment/book")}
              style={styles.ctaButton}
            />
          </Card>
        )}

        {/* Educational Tip */}
        <Card style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="information-circle" size={24} color={Colors.info} />
            <Text style={styles.tipTitle}>Did You Know?</Text>
          </View>
          <Text style={styles.tipText}>
            One blood donation from a large dog can save up to 3 lives! Regular donations help
            maintain critical blood supplies for emergency surgeries and treatments.
          </Text>
        </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Sizes.spacing.md,
    paddingBottom: Sizes.spacing.md,
  },
  header: {
    marginBottom: Sizes.spacing.xxl,
  },
  greeting: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  userName: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 32,
    color: Colors.text,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.spacing.sm,
    gap: Sizes.spacing.xs,
  },
  tagline: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.spacing.md,
    marginBottom: Sizes.spacing.xxl,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
  },
  statCardInner: {
    alignItems: "center",
    padding: Sizes.spacing.lg,
  },
  statIconContainer: {
    marginBottom: Sizes.spacing.sm,
  },
  successCard: {
    backgroundColor: Colors.successLight + "15",
    borderColor: Colors.success + "30",
    borderWidth: 1,
  },
  primaryCard: {
    backgroundColor: Colors.primaryLight + "15",
    borderColor: Colors.primary + "30",
    borderWidth: 1,
  },
  infoCardStyle: {
    backgroundColor: Colors.infoLight + "15",
    borderColor: Colors.info + "30",
    borderWidth: 1,
  },
  statValue: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 32,
    color: Colors.primary,
    marginBottom: Sizes.spacing.xs,
  },
  statLabel: {
    fontFamily: "SourceSans3_600SemiBold",
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  statHint: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
  section: {
    marginBottom: Sizes.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.spacing.md,
  },
  sectionTitle: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 22,
    color: Colors.text,
    marginBottom: Sizes.spacing.xl,
  },
  seeAllText: {
    fontFamily: "SourceSans3_600SemiBold",
    fontSize: 14,
    color: Colors.primary,
  },
  appointmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Sizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentPet: {
    fontFamily: "SourceSans3_600SemiBold",
    fontSize: 16,
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  appointmentDate: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Sizes.spacing.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: Colors.backgroundSecondary,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryAction: {
    backgroundColor: Colors.primaryLight + "20",
    borderColor: Colors.primary,
  },
  actionHint: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionIconStyle: {
    marginBottom: Sizes.spacing.sm,
  },
  actionText: {
    fontFamily: "SourceSans3_600SemiBold",
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
  },
  ctaCard: {
    backgroundColor: Colors.primaryLight + "20",
    borderColor: Colors.primary,
    borderWidth: 2,
    alignItems: "center",
  },
  ctaEmojiContainer: {
    marginBottom: Sizes.spacing.md,
  },
  ctaTitle: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 20,
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  ctaText: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.md,
    lineHeight: 20,
  },
  ctaButton: {
    alignSelf: "stretch",
  },
  infoCard: {
    marginBottom: Sizes.spacing.xxl,
    backgroundColor: Colors.infoLight + "15",
    borderColor: Colors.info,
    borderWidth: 1,
    padding: Sizes.spacing.lg,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.spacing.md,
    gap: Sizes.spacing.sm,
  },
  infoTitle: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  infoText: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.md,
    lineHeight: 20,
  },
  infoSteps: {
    marginBottom: Sizes.spacing.md,
    paddingLeft: Sizes.spacing.sm,
  },
  infoStep: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 14,
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
    lineHeight: 20,
  },
  infoButton: {
    alignSelf: "stretch",
  },
  impactNote: {
    marginTop: Sizes.spacing.md,
    padding: Sizes.spacing.sm,
    backgroundColor: Colors.successLight + "20",
    borderRadius: Sizes.borderRadius.sm,
  },
  impactNoteText: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 13,
    color: Colors.successDark,
    textAlign: "center",
    lineHeight: 18,
  },
  tipCard: {
    marginBottom: Sizes.spacing.xxl,
    backgroundColor: Colors.infoLight + "15",
    borderColor: Colors.info + "30",
    borderWidth: 1,
    padding: Sizes.spacing.lg,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.spacing.md,
    gap: Sizes.spacing.sm,
  },
  tipTitle: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: 16,
    color: Colors.text,
  },
  tipText: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
});
