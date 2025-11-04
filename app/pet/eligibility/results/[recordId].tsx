import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EligibilityService } from '../../../../services/eligibility.service';
import { EligibilityRecord, DisqualifyingFactor } from '../../../../types/eligibility.types';
import { Colors } from '../../../../constants/Colors';
import { Sizes } from '../../../../constants/Sizes';
import { Button, Card, Badge } from '../../../../components/ui';
import {
  formatEligibilityStatus,
  getStatusColor,
  getGuidanceMessage,
} from '../../../../utils/eligibility';

export default function EligibilityResultsScreen() {
  const { recordId } = useLocalSearchParams<{ recordId: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<EligibilityRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEligibilityRecord();
  }, [recordId]);

  const loadEligibilityRecord = async () => {
    try {
      setLoading(true);
      // In a real app, we'd fetch by eligibility ID
      // For now, we'll get by pet ID (simplified)
      const allRecords = await EligibilityService.getEligibilityHistory(recordId);
      if (allRecords.length > 0) {
        setRecord(allRecords[0]);
      } else {
        Alert.alert('Error', 'Eligibility record not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading eligibility record:', error);
      Alert.alert('Error', 'Failed to load eligibility results');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (record?.overallStatus === 'ELIGIBLE') {
      // Navigate to consent form
      router.push({
        pathname: '/consent/[petId]',
        params: { petId: record.petId },
      });
    } else {
      // Go back to pet detail
      router.push({
        pathname: '/pet/[id]',
        params: { id: record?.petId },
      });
    }
  };

  const handleRetake = () => {
    router.replace({
      pathname: '/pet/eligibility/[id]',
      params: { id: record?.petId },
    });
  };

  const renderStatusIcon = () => {
    const status = record?.overallStatus || '';
    let icon = '';
    let color = getStatusColor(status);

    switch (status) {
      case 'ELIGIBLE':
        icon = '✓';
        break;
      case 'PENDING_REVIEW':
        icon = '⏳';
        break;
      case 'TEMPORARILY_INELIGIBLE':
        icon = '⚠️';
        break;
      case 'INELIGIBLE':
        icon = '✗';
        break;
      default:
        icon = '?';
    }

    return (
      <View style={[styles.statusIconContainer, { backgroundColor: color + '20' }]}>
        <Text style={[styles.statusIcon, { color }]}>{icon}</Text>
      </View>
    );
  };

  const renderDisqualifyingFactors = () => {
    if (!record || record.disqualifyingFactors.length === 0) return null;

    const permanentFactors = record.disqualifyingFactors.filter(
      (f) => f.severity === 'PERMANENT'
    );
    const temporaryFactors = record.disqualifyingFactors.filter(
      (f) => f.severity === 'TEMPORARY'
    );

    return (
      <View style={styles.factorsContainer}>
        <Text style={styles.sectionTitle}>Issues Found</Text>

        {permanentFactors.length > 0 && (
          <Card style={styles.factorCard}>
            <Text style={styles.factorCategoryTitle}>Permanent Disqualifications</Text>
            {permanentFactors.map((factor, index) => (
              <View key={index} style={styles.factorItem}>
                <Text style={styles.factorBullet}>•</Text>
                <Text style={styles.factorText}>{factor.description}</Text>
              </View>
            ))}
          </Card>
        )}

        {temporaryFactors.length > 0 && (
          <Card style={styles.factorCard}>
            <Text style={styles.factorCategoryTitle}>Temporary Issues</Text>
            {temporaryFactors.map((factor, index) => (
              <View key={index} style={styles.factorItem}>
                <Text style={styles.factorBullet}>•</Text>
                <View style={styles.factorContent}>
                  <Text style={styles.factorText}>{factor.description}</Text>
                  {factor.reviewDate && (
                    <Text style={styles.reviewDateText}>
                      Review after: {new Date(factor.reviewDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}
      </View>
    );
  };

  const renderNextSteps = () => {
    if (!record) return null;

    const status = record.overallStatus;
    const hasTemporaryFactors = record.disqualifyingFactors.some(
      (f) => f.severity === 'TEMPORARY'
    );

    return (
      <Card style={styles.nextStepsCard}>
        <Text style={styles.sectionTitle}>Next Steps</Text>
        <Text style={styles.guidanceText}>
          {getGuidanceMessage(status, hasTemporaryFactors)}
        </Text>

        {record.nextReviewDate && (
          <View style={styles.reviewDateContainer}>
            <Text style={styles.reviewDateLabel}>Next Review Date:</Text>
            <Text style={styles.reviewDateValue}>
              {new Date(record.nextReviewDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </Card>
    );
  };

  if (loading || !record) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const status = record.overallStatus;
  const isEligible = status === 'ELIGIBLE';
  const hasTemporaryFactors = record.disqualifyingFactors.some(
    (f) => f.severity === 'TEMPORARY'
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {renderStatusIcon()}
          <Text style={styles.title}>Eligibility Assessment</Text>
          <Badge
            label={formatEligibilityStatus(status)}
            variant={
              isEligible
                ? 'success'
                : status === 'PENDING_REVIEW'
                ? 'warning'
                : 'error'
            }
            style={styles.statusBadge}
          />
        </View>

        {renderNextSteps()}
        {renderDisqualifyingFactors()}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About This Assessment</Text>
          <Text style={styles.infoText}>
            This eligibility assessment is based on the information you provided. If your
            pet's health status changes, please retake the questionnaire to ensure accurate
            eligibility status.
          </Text>
          <Text style={styles.infoText}>
            Submitted on: {new Date(record.submittedAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {hasTemporaryFactors && (
          <Button
            title="Retake Questionnaire"
            onPress={handleRetake}
            variant="outline"
            style={styles.footerButton}
          />
        )}
        <Button
          title={isEligible ? 'Continue to Consent' : 'Back to Pet Profile'}
          onPress={handleContinue}
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
    alignItems: 'center',
    marginBottom: Sizes.spacing.xl,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.spacing.md,
  },
  statusIcon: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
    textAlign: 'center',
  },
  statusBadge: {
    marginTop: Sizes.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  nextStepsCard: {
    marginBottom: Sizes.spacing.lg,
  },
  guidanceText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: Sizes.spacing.md,
  },
  reviewDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Sizes.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  reviewDateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginRight: Sizes.spacing.sm,
  },
  reviewDateValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  factorsContainer: {
    marginBottom: Sizes.spacing.lg,
  },
  factorCard: {
    marginBottom: Sizes.spacing.md,
  },
  factorCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: Sizes.spacing.sm,
  },
  factorBullet: {
    fontSize: 16,
    color: Colors.text,
    marginRight: Sizes.spacing.sm,
    marginTop: 2,
  },
  factorContent: {
    flex: 1,
  },
  factorText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  reviewDateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Sizes.spacing.xs,
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    marginBottom: Sizes.spacing.lg,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Sizes.spacing.sm,
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
