import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DonationRecord } from '@/types/donation.types';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface DonationCardProps {
  donation: DonationRecord;
  petName?: string;
  facilityName?: string;
  onPress?: () => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  petName,
  facilityName,
  onPress,
}) => {
  const getStatusVariant = () => {
    return donation.donationStatus === 'ACCEPTED' ? 'success' : 'error';
  };

  const getUsageVariant = () => {
    switch (donation.usageStatus) {
      case 'USED':
        return 'success';
      case 'STORED':
        return 'info';
      case 'EXPIRED':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="elevated" padding="md" onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(donation.donationDate)}</Text>
            {petName && (
              <View style={styles.petNameContainer}>
                <Ionicons name="paw" size={14} color={Colors.primary} />
                <Text style={styles.petName}>{petName}</Text>
              </View>
            )}
          </View>
          <View style={styles.badges}>
            <Badge
              label={donation.donationStatus}
              variant={getStatusVariant()}
              size="sm"
            />
          </View>
        </View>

        <View style={styles.content}>
          {facilityName && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Facility:</Text>
              <Text style={styles.value}>{facilityName}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Volume:</Text>
            <Text style={styles.value}>
              {donation.collectionDetails.volumeCollected} ml
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>
              {donation.collectionDetails.duration} min
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <Badge
              label={donation.usageStatus}
              variant={getUsageVariant()}
              size="sm"
            />
          </View>

          <View style={styles.nextEligible}>
            <Text style={styles.nextEligibleLabel}>Next eligible:</Text>
            <Text style={styles.nextEligibleDate}>
              {formatDate(donation.nextEligibleDate)}
            </Text>
          </View>
        </View>

        {donation.adverseReactions && (
          <View style={styles.warning}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>Adverse reactions noted</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Sizes.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs / 2,
  },
  petNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.xs,
    marginTop: Sizes.spacing.xs,
  },
  petName: {
    fontSize: Sizes.fontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  badges: {
    alignItems: 'flex-end',
  },
  content: {
    gap: Sizes.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  nextEligible: {
    backgroundColor: Colors.successLight + '30',
    padding: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Sizes.spacing.xs,
  },
  nextEligibleLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.successDark,
    fontWeight: '600',
  },
  nextEligibleDate: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.successDark,
    fontWeight: '700',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight + '30',
    padding: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
  },
  warningIcon: {
    fontSize: Sizes.fontSize.md,
    marginRight: Sizes.spacing.sm,
  },
  warningText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.warningDark,
    fontWeight: '600',
  },
});
