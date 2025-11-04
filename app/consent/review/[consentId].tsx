import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ConsentService } from '../../../services/consent.service';
import { ConsentRecord } from '../../../types/consent.types';
import { Colors } from '../../../constants/Colors';
import { Sizes } from '../../../constants/Sizes';
import { Button, Card, Badge } from '../../../components/ui';

export default function ConsentReviewScreen() {
  const { consentId } = useLocalSearchParams<{ consentId: string }>();
  const router = useRouter();
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsent();
  }, [consentId]);

  const loadConsent = async () => {
    try {
      setLoading(true);
      const consentRecord = await ConsentService.getConsentById(consentId);
      if (consentRecord) {
        setConsent(consentRecord);
      } else {
        Alert.alert('Error', 'Consent record not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading consent:', error);
      Alert.alert('Error', 'Failed to load consent record');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailCopy = async () => {
    if (!consent) return;

    Alert.prompt(
      'Email Consent Copy',
      'Enter your email address to receive a copy of this consent form:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: async (email?: string) => {
            if (email) {
              try {
                await ConsentService.emailConsentCopy(consent.consentId, email);
                Alert.alert('Success', `Consent copy sent to ${email}`);
              } catch (error) {
                Alert.alert('Error', 'Failed to send email');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleShare = async () => {
    if (!consent) return;

    try {
      await Share.share({
        message: `Blood Donor Consent - Signed on ${new Date(
          consent.signedAt
        ).toLocaleDateString()}\nConsent ID: ${consent.consentId}`,
        title: 'Blood Donor Consent',
      });
    } catch (error) {
      console.error('Error sharing consent:', error);
    }
  };

  const handleRevoke = () => {
    if (!consent) return;

    Alert.alert(
      'Revoke Consent',
      'Are you sure you want to revoke this consent? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              await ConsentService.revokeConsent(
                consent.consentId,
                'Revoked by user'
              );
              Alert.alert('Success', 'Consent has been revoked', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to revoke consent');
            }
          },
        },
      ]
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'EXPIRED':
        return 'warning';
      case 'REVOKED':
        return 'error';
      case 'PENDING_RENEWAL':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading || !consent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isActive = consent.status === 'ACTIVE';
  const daysUntilExpiration = Math.floor(
    (new Date(consent.expiresAt).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Consent Form Review</Text>
          <Badge
            label={formatStatus(consent.status)}
            variant={getStatusBadgeVariant(consent.status)}
            size="lg"
          />
        </View>

        {/* Status Information */}
        <Card style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Consent ID:</Text>
            <Text style={styles.infoValue}>{consent.consentId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Signed On:</Text>
            <Text style={styles.infoValue}>
              {new Date(consent.signedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expires On:</Text>
            <Text style={styles.infoValue}>
              {new Date(consent.expiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          {isActive && daysUntilExpiration <= 30 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ This consent will expire in {daysUntilExpiration} days. Please renew
                soon.
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Form Version:</Text>
            <Text style={styles.infoValue}>{consent.consentFormVersion}</Text>
          </View>
        </Card>

        {/* Owner Certification */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Certification</Text>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.ownerCertification ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Legal owner certification</Text>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.authorizedAgent ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Authorized agent (if applicable)</Text>
          </View>
        </Card>

        {/* Authorization for Procedures */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Authorization for Procedures</Text>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.authorizesBloodCollection ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Blood collection</Text>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.authorizesSedation ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Sedation if necessary</Text>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.authorizesPreExam ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Pre-donation examination</Text>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.authorizesBloodScreening ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Blood screening and tests</Text>
          </View>
        </Card>

        {/* Risk Acknowledgment */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Acknowledgment</Text>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.understandsRisks ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Understands risks</Text>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.risksExplained ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Risks explained by veterinarian</Text>
          </View>
        </Card>

        {/* Program Commitment */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Program Commitment</Text>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.commitsToProgram ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Commits to program</Text>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.understandsFrequencyLimits ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Understands frequency limits</Text>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.agreesToNotifyHealthChanges ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Agrees to notify health changes</Text>
          </View>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.acknowledgesCancellationPolicy ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>Acknowledges cancellation policy</Text>
          </View>
        </Card>

        {/* Publicity Release */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Publicity Release</Text>
          <View style={styles.checkItem}>
            <Text style={styles.checkIcon}>
              {consent.consentData.allowsPublicity ? '✓' : '✗'}
            </Text>
            <Text style={styles.checkText}>
              Allows promotional use of pet's photo and story
            </Text>
          </View>
        </Card>

        {/* Additional Notes */}
        {consent.consentData.additionalNotes && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.notesText}>{consent.consentData.additionalNotes}</Text>
          </Card>
        )}

        {/* Digital Signature */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Signature</Text>
          <View style={styles.signatureContainer}>
            <Image
              source={{ uri: consent.signatureDataUrl }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.signatureDate}>
            Signed on {new Date(consent.signedAt).toLocaleDateString()}
          </Text>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Button
          title="Email Copy"
          onPress={handleEmailCopy}
          variant="outline"
          size="sm"
          style={styles.actionButton}
        />
        <Button
          title="Share"
          onPress={handleShare}
          variant="outline"
          size="sm"
          style={styles.actionButton}
        />
        {isActive && (
          <Button
            title="Revoke"
            onPress={handleRevoke}
            variant="outline"
            size="sm"
            style={styles.actionButton}
          />
        )}
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
    alignItems: 'center',
    marginBottom: Sizes.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  section: {
    marginBottom: Sizes.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  warningBox: {
    backgroundColor: Colors.warningLight + '40',
    padding: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
    marginTop: Sizes.spacing.sm,
  },
  warningText: {
    fontSize: 14,
    color: Colors.warningDark,
    textAlign: 'center',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Sizes.spacing.sm,
  },
  checkIcon: {
    fontSize: 18,
    color: Colors.success,
    marginRight: Sizes.spacing.sm,
    width: 24,
  },
  checkText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  notesText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  signatureContainer: {
    height: 150,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Sizes.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Sizes.spacing.sm,
    marginBottom: Sizes.spacing.sm,
  },
  signatureImage: {
    width: '100%',
    height: '100%',
  },
  signatureDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
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
    gap: Sizes.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  revokeButton: {
    borderColor: Colors.error,
  },
});
