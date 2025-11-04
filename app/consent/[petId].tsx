import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePets } from '../../hooks';
import { useAuth } from '../../hooks';
import { ConsentService } from '../../services/consent.service';
import { ConsentData } from '../../types/consent.types';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { Button, Card, Input } from '../../components/ui';
import { FormCheckbox, FormField } from '../../components/forms';
import { SignaturePad } from '../../components/consent';

export default function ConsentFormScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const router = useRouter();
  const { pets, isLoading: petsLoading } = usePets();
  const { user } = useAuth();
  const [pet, setPet] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');

  // Consent form state
  const [consentData, setConsentData] = useState<ConsentData>({
    ownerCertification: false,
    authorizedAgent: false,
    authorizesBloodCollection: false,
    authorizesSedation: false,
    authorizesPreExam: false,
    authorizesBloodScreening: false,
    understandsRisks: false,
    risksExplained: false,
    commitsToProgram: false,
    understandsFrequencyLimits: false,
    agreesToNotifyHealthChanges: false,
    acknowledgesCancellationPolicy: false,
    allowsPublicity: false,
    additionalNotes: '',
  });

  useEffect(() => {
    if (!petsLoading && pets.length > 0) {
      const foundPet = pets.find((p) => p.petId === petId);
      if (foundPet) {
        setPet(foundPet);
      } else {
        Alert.alert('Error', 'Pet not found');
        router.back();
      }
    }
  }, [petsLoading, pets, petId]);

  const validateForm = (): boolean => {
    const requiredFields: (keyof ConsentData)[] = [
      'ownerCertification',
      'authorizesBloodCollection',
      'authorizesSedation',
      'authorizesPreExam',
      'authorizesBloodScreening',
      'understandsRisks',
      'risksExplained',
      'commitsToProgram',
      'understandsFrequencyLimits',
      'agreesToNotifyHealthChanges',
      'acknowledgesCancellationPolicy',
    ];

    for (const field of requiredFields) {
      if (!consentData[field]) {
        Alert.alert('Incomplete Form', `Please check all required fields.`);
        return false;
      }
    }

    if (!signatureData) {
      Alert.alert('Signature Required', 'Please provide your signature to continue.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const consentRecord = await ConsentService.createConsent(
        petId,
        user?.userId || '',
        consentData,
        signatureData,
        '0.0.0.0' // In real app, get actual IP
      );

      Alert.alert(
        'Consent Signed',
        'Your consent has been successfully recorded. You can now proceed to book an appointment.',
        [
          {
            text: 'View Consent',
            onPress: () => {
              router.replace({
                pathname: '/consent/review/[consentId]',
                params: { consentId: consentRecord.consentId },
              });
            },
          },
          {
            text: 'Book Appointment',
            onPress: () => {
              router.push({
                pathname: '/appointment/book',
                params: { petId },
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting consent:', error);
      Alert.alert('Error', 'Failed to submit consent. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignatureSave = (signature: string) => {
    setSignatureData(signature);
    Alert.alert('Success', 'Signature saved successfully.');
  };

  const handleSignatureClear = () => {
    setSignatureData('');
  };

  if (petsLoading || !pet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Blood Donor Consent Form</Text>
          <Text style={styles.subtitle}>for {pet.name}</Text>
          <Text style={styles.version}>Form Version 1.0.0</Text>
        </View>

        {/* Owner Certification */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Certification</Text>
          <Text style={styles.sectionDescription}>
            Please confirm your ownership and authority to consent.
          </Text>

          <FormCheckbox
            label="I certify that I am the legal owner of the above-named animal"
            value={consentData.ownerCertification}
            onChange={(value) =>
              setConsentData({ ...consentData, ownerCertification: value })
            }
          />

          <FormCheckbox
            label="I am authorized to make medical decisions for this animal (if applicable)"
            value={consentData.authorizedAgent}
            onChange={(value) =>
              setConsentData({ ...consentData, authorizedAgent: value })
            }
          />
        </Card>

        {/* Authorization for Procedures */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Authorization for Procedures</Text>
          <Text style={styles.sectionDescription}>
            I authorize the following procedures for my pet as part of the blood donation
            program:
          </Text>

          <FormCheckbox
            label="Blood collection for donation purposes"
            value={consentData.authorizesBloodCollection}
            onChange={(value) =>
              setConsentData({ ...consentData, authorizesBloodCollection: value })
            }
          />

          <FormCheckbox
            label="Sedation if deemed necessary by the veterinarian"
            value={consentData.authorizesSedation}
            onChange={(value) =>
              setConsentData({ ...consentData, authorizesSedation: value })
            }
          />

          <FormCheckbox
            label="Pre-donation physical examination"
            value={consentData.authorizesPreExam}
            onChange={(value) =>
              setConsentData({ ...consentData, authorizesPreExam: value })
            }
          />

          <FormCheckbox
            label="Blood screening and laboratory tests"
            value={consentData.authorizesBloodScreening}
            onChange={(value) =>
              setConsentData({ ...consentData, authorizesBloodScreening: value })
            }
          />
        </Card>

        {/* Risk Acknowledgment */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Acknowledgment</Text>
          <Text style={styles.sectionDescription}>
            I understand that blood donation involves certain risks, including but not
            limited to: adverse reactions to sedation, bleeding, infection, or other
            complications.
          </Text>

          <FormCheckbox
            label="I understand the risks associated with blood donation"
            value={consentData.understandsRisks}
            onChange={(value) =>
              setConsentData({ ...consentData, understandsRisks: value })
            }
          />

          <FormCheckbox
            label="The risks have been explained to me by a qualified veterinarian"
            value={consentData.risksExplained}
            onChange={(value) =>
              setConsentData({ ...consentData, risksExplained: value })
            }
          />
        </Card>

        {/* Program Commitment */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Program Commitment</Text>
          <Text style={styles.sectionDescription}>
            As a participant in the blood donor program, I agree to the following:
          </Text>

          <FormCheckbox
            label="I commit to making my pet available for donations as needed"
            value={consentData.commitsToProgram}
            onChange={(value) =>
              setConsentData({ ...consentData, commitsToProgram: value })
            }
          />

          <FormCheckbox
            label="I understand the frequency limits for blood donations"
            value={consentData.understandsFrequencyLimits}
            onChange={(value) =>
              setConsentData({ ...consentData, understandsFrequencyLimits: value })
            }
          />

          <FormCheckbox
            label="I agree to notify the program of any health changes in my pet"
            value={consentData.agreesToNotifyHealthChanges}
            onChange={(value) =>
              setConsentData({ ...consentData, agreesToNotifyHealthChanges: value })
            }
          />

          <FormCheckbox
            label="I acknowledge the cancellation policy (24-hour notice required)"
            value={consentData.acknowledgesCancellationPolicy}
            onChange={(value) =>
              setConsentData({ ...consentData, acknowledgesCancellationPolicy: value })
            }
          />
        </Card>

        {/* Publicity Release (Optional) */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Publicity Release (Optional)</Text>
          <Text style={styles.sectionDescription}>
            Help us promote the blood donor program by allowing us to share your pet's
            story.
          </Text>

          <FormCheckbox
            label="I allow my pet's photo and story to be used for promotional purposes"
            value={consentData.allowsPublicity}
            onChange={(value) =>
              setConsentData({ ...consentData, allowsPublicity: value })
            }
          />
        </Card>

        {/* Additional Notes */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <FormField label="Any additional information or concerns">
            <Input
              placeholder="Enter any additional notes..."
              value={consentData.additionalNotes}
              onChangeText={(value) =>
                setConsentData({ ...consentData, additionalNotes: value })
              }
              multiline
              numberOfLines={4}
            />
          </FormField>
        </Card>

        {/* Digital Signature */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Signature</Text>
          <Text style={styles.sectionDescription}>
            By signing below, I acknowledge that I have read and understood this consent
            form, and I agree to all the terms and conditions stated above.
          </Text>

          <SignaturePad
            onSave={handleSignatureSave}
            onClear={handleSignatureClear}
          />

          {signatureData && (
            <View style={styles.signatureConfirmation}>
              <Text style={styles.signatureConfirmationText}>✓ Signature captured</Text>
            </View>
          )}
        </Card>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This consent is valid for 12 months from the date of signing. You will be
            notified when renewal is required. You may revoke this consent at any time by
            contacting the program administrator.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={styles.footerButton}
        />
        <Button
          title={submitting ? 'Submitting...' : 'Submit Consent'}
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Sizes.spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: Sizes.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  version: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  section: {
    marginBottom: Sizes.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Sizes.spacing.md,
  },
  signatureConfirmation: {
    backgroundColor: Colors.successLight + '40',
    padding: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
    alignItems: 'center',
    marginTop: Sizes.spacing.md,
  },
  signatureConfirmationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.successDark,
  },
  disclaimer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    marginBottom: Sizes.spacing.lg,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Sizes.spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Sizes.spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
