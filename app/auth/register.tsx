import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormCheckbox } from "@/components/forms/FormCheckbox";
import { useAuth } from "@/hooks/useAuth";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      console.log('[Register] Attempting registration for:', formData.email);
      const result = await register(fullName, formData.email, formData.password, formData.phone);
      console.log('[Register] Registration result:', result);
      
      if (result?.success) {
        console.log('[Register] Success! Navigating to /tabs');
        router.replace("/tabs");
      } else {
        console.log('[Register] Failed:', result?.error);
        setErrors({ email: result?.error || "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error('[Register] Error:', error);
      setErrors({ email: "Registration failed. Please try again." });
    }
  };

  const handleLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogin} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us in saving lives through blood donation</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <Input
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChangeText={(text) => updateField("firstName", text)}
              error={errors.firstName}
              containerStyle={styles.halfInput}
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChangeText={(text) => updateField("lastName", text)}
              error={errors.lastName}
              containerStyle={styles.halfInput}
              required
            />
          </View>

          <Input
            label="Email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            required
          />

          <Input
            label="Phone Number"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChangeText={(text) => updateField("phone", text)}
            error={errors.phone}
            keyboardType="phone-pad"
            autoComplete="tel"
            required
          />

          <Input
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
            error={errors.password}
            // secureTextEntry
            helperText="Min 8 characters with uppercase, lowercase, and number"
            required
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField("confirmPassword", text)}
            error={errors.confirmPassword}
            // secureTextEntry
            required
          />

          <FormCheckbox
            label="I agree to the Terms of Service and Privacy Policy"
            value={formData.agreeToTerms}
            onChange={(value) => updateField("agreeToTerms", value)}
            error={errors.agreeToTerms}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            style={styles.registerButton}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    padding: Sizes.spacing.lg,
  },
  header: {
    marginBottom: Sizes.spacing.xl,
  },
  backButton: {
    marginBottom: Sizes.spacing.md,
  },
  backText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  subtitle: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: Sizes.spacing.xl,
  },
  row: {
    flexDirection: "row",
    gap: Sizes.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  registerButton: {
    marginTop: Sizes.spacing.md,
    marginBottom: Sizes.spacing.lg,
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPromptText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.primary,
    fontWeight: "600",
  },
});
