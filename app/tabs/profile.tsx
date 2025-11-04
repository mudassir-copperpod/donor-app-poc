import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { Badge } from "@/components/ui/Badge";
import { FormCheckbox } from "@/components/forms/FormCheckbox";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const { getCurrentLocation, isLoading: locationLoading } = useLocation();

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
  });

  const [preferencesData, setPreferencesData] = useState({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: true,
    emergencyAlerts: true,
    appointmentReminders: true,
    generalUpdates: true,
    radius: 25,
  });

  // Update editData when user changes
  useEffect(() => {
    if (user) {
      setEditData({
        fullName: user.fullName,
        email: user.contactInfo.email,
        phone: user.contactInfo.phones.mobile,
      });
      setAddressData(user.contactInfo.address);
      setPreferencesData(user.preferences);
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    // Refresh data before opening modal
    if (user) {
      setEditData({
        fullName: user.fullName,
        email: user.contactInfo.email,
        phone: user.contactInfo.phones.mobile,
      });
    }
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        fullName: editData.fullName,
        contactInfo: {
          ...user?.contactInfo!,
          email: editData.email,
          phones: {
            ...user?.contactInfo.phones!,
            mobile: editData.phone,
          },
        },
      });
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleEditAddress = () => {
    if (user) {
      setAddressData(user.contactInfo.address);
    }
    setAddressModalVisible(true);
  };

  const handleUseCurrentLocation = async () => {
    const result = await getCurrentLocation();
    if (result.success && result.location) {
      // In a real app, you would reverse geocode the coordinates
      Alert.alert(
        "Location Detected",
        "In production, this would auto-fill your address based on GPS coordinates."
      );
    } else {
      Alert.alert("Error", result.error || "Failed to get location");
    }
  };

  const handleSaveAddress = async () => {
    try {
      await updateProfile({
        contactInfo: {
          ...user?.contactInfo!,
          address: addressData,
        },
      });
      setAddressModalVisible(false);
      Alert.alert("Success", "Address updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update address");
    }
  };

  const handleEditPreferences = () => {
    if (user) {
      setPreferencesData(user.preferences);
    }
    setPreferencesModalVisible(true);
  };

  const handleSavePreferences = async () => {
    try {
      await updateProfile({
        preferences: preferencesData,
      });
      setPreferencesModalVisible(false);
      Alert.alert("Success", "Notification preferences updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update preferences");
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Please login to view profile</Text>
          <Button title="Go to Login" onPress={() => router.replace("/auth/login")} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user.fullName.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.contactInfo.email}</Text>

          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            size="sm"
            style={styles.editButton}
          />
        </View>

        {/* Personal Information */}
        <Card variant="elevated" padding="md" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.contactInfo.phones.mobile}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.infoValue}>
                {user.contactInfo.address.street || "Not set"}
                {user.contactInfo.address.street &&
                  `, ${user.contactInfo.address.city}, ${user.contactInfo.address.state} ${user.contactInfo.address.postalCode}`}
              </Text>
              <TouchableOpacity onPress={handleEditAddress}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <Text style={[styles.infoValue, styles.statusActive]}>{user.accountStatus}</Text>
          </View>
        </Card>

        {/* Emergency Contact */}
        {user.emergencyContact && (
          <Card variant="elevated" padding="md" style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user.emergencyContact.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Relationship</Text>
              <Text style={styles.infoValue}>{user.emergencyContact.relationship}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.emergencyContact.phone}</Text>
            </View>
          </Card>
        )}

        {/* Notification Preferences */}
        <Card variant="elevated" padding="md" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            <TouchableOpacity onPress={handleEditPreferences}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Notifications</Text>
            <Text style={styles.infoValue}>
              {user.preferences?.emailEnabled ? "Enabled" : "Disabled"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SMS Notifications</Text>
            <Text style={styles.infoValue}>
              {user.preferences?.smsEnabled ? "Enabled" : "Disabled"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Push Notifications</Text>
            <Text style={styles.infoValue}>
              {user.preferences?.pushEnabled ? "Enabled" : "Disabled"}
            </Text>
          </View>
        </Card>

        {/* Actions */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          fullWidth
          style={styles.logoutButton}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Edit Profile"
        variant="bottom-sheet"
      >
        <View style={styles.modalContent}>
          <Input
            label="Full Name"
            value={editData.fullName}
            onChangeText={(text) => setEditData({ ...editData, fullName: text })}
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            value={editData.email}
            onChangeText={(text) => setEditData({ ...editData, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone"
            value={editData.phone}
            onChangeText={(text) => setEditData({ ...editData, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <Button
            title="Save Changes"
            onPress={handleSaveProfile}
            loading={isLoading}
            fullWidth
            style={styles.saveButton}
          />
        </View>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        title="Edit Address"
        variant="bottom-sheet"
      >
        <View style={styles.modalContent}>
          <Button
            title="Use Current Location"
            onPress={handleUseCurrentLocation}
            loading={locationLoading}
            variant="outline"
            fullWidth
          />

          <Input
            label="Street Address"
            value={addressData.street}
            onChangeText={(text) => setAddressData({ ...addressData, street: text })}
            placeholder="123 Main St"
          />

          <View style={styles.row}>
            <Input
              label="City"
              value={addressData.city}
              onChangeText={(text) => setAddressData({ ...addressData, city: text })}
              placeholder="City"
              containerStyle={styles.halfInput}
            />
            <Input
              label="State"
              value={addressData.state}
              onChangeText={(text) => setAddressData({ ...addressData, state: text })}
              placeholder="CA"
              containerStyle={styles.halfInput}
            />
          </View>

          <Input
            label="Postal Code"
            value={addressData.postalCode}
            onChangeText={(text) => setAddressData({ ...addressData, postalCode: text })}
            placeholder="12345"
            keyboardType="number-pad"
          />

          <Button
            title="Save Address"
            onPress={handleSaveAddress}
            loading={isLoading}
            fullWidth
            style={styles.saveButton}
          />
        </View>
      </Modal>

      {/* Edit Preferences Modal */}
      <Modal
        visible={preferencesModalVisible}
        onClose={() => setPreferencesModalVisible(false)}
        title="Notification Preferences"
        variant="bottom-sheet"
      >
        <View style={styles.modalContent}>
          <Text style={styles.preferencesDescription}>
            Choose how you'd like to be contacted for appointments, emergencies, and updates.
          </Text>

          <FormCheckbox
            label="Email Notifications"
            value={preferencesData.emailEnabled}
            onChange={(value) => setPreferencesData({ ...preferencesData, emailEnabled: value })}
          />

          <FormCheckbox
            label="SMS Notifications"
            value={preferencesData.smsEnabled}
            onChange={(value) => setPreferencesData({ ...preferencesData, smsEnabled: value })}
          />

          <FormCheckbox
            label="Push Notifications"
            value={preferencesData.pushEnabled}
            onChange={(value) => setPreferencesData({ ...preferencesData, pushEnabled: value })}
          />

          <View style={styles.divider} />

          <FormCheckbox
            label="Emergency Alerts"
            value={preferencesData.emergencyAlerts}
            onChange={(value) => setPreferencesData({ ...preferencesData, emergencyAlerts: value })}
          />

          <FormCheckbox
            label="Appointment Reminders"
            value={preferencesData.appointmentReminders}
            onChange={(value) =>
              setPreferencesData({ ...preferencesData, appointmentReminders: value })
            }
          />

          <FormCheckbox
            label="General Updates"
            value={preferencesData.generalUpdates}
            onChange={(value) => setPreferencesData({ ...preferencesData, generalUpdates: value })}
          />

          <Button
            title="Save Preferences"
            onPress={handleSavePreferences}
            loading={isLoading}
            fullWidth
            style={styles.saveButton}
          />
        </View>
      </Modal>
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
    paddingHorizontal: Sizes.spacing.lg,
    paddingBottom: Sizes.spacing.lg,
    paddingTop: Sizes.spacing.md,
  },
  header: {
    alignItems: "center",
    marginBottom: Sizes.spacing.xxl,
  },
  avatarContainer: {
    marginBottom: Sizes.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray200,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: "700",
    color: Colors.white,
  },
  name: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: Sizes.fontSize.xxl,
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  email: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.md,
  },
  editButton: {
    minWidth: 120,
  },
  section: {
    marginBottom: Sizes.spacing.lg,
  },
  sectionTitle: {
    fontFamily: "SourceSans3_700Bold",
    fontSize: Sizes.fontSize.lg,
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: Sizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontFamily: "SourceSans3_600SemiBold",
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    flex: 2,
    textAlign: "right",
  },
  statusActive: {
    color: Colors.success,
  },
  logoutButton: {
    marginTop: Sizes.spacing.lg,
    marginBottom: Sizes.spacing.xl,
  },
  errorText: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: Sizes.fontSize.md,
    color: Colors.error,
    marginBottom: Sizes.spacing.md,
  },
  modalContent: {
    gap: Sizes.spacing.md,
  },
  saveButton: {
    marginTop: Sizes.spacing.md,
  },
  statusBadge: {
    marginBottom: Sizes.spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.spacing.md,
  },
  addressContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editLink: {
    fontFamily: "SourceSans3_600SemiBold",
    fontSize: Sizes.fontSize.sm,
    color: Colors.primary,
    marginLeft: Sizes.spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: Sizes.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  preferencesDescription: {
    fontFamily: "SourceSans3_400Regular",
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Sizes.spacing.md,
  },
});
