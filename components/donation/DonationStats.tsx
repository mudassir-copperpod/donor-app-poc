import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Card } from '@/components/ui/Card';

interface DonationStatsProps {
  totalDonations: number;
  totalVolume: number;
  livesSaved: number;
  nextEligibleDate?: string;
}

export const DonationStats: React.FC<DonationStatsProps> = ({
  totalDonations,
  totalVolume,
  livesSaved,
  nextEligibleDate,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilEligible = () => {
    if (!nextEligibleDate) return null;
    
    const today = new Date();
    const eligible = new Date(nextEligibleDate);
    const diffTime = eligible.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysUntil = getDaysUntilEligible();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card variant="elevated" padding="md" style={styles.statCard}>
          <Text style={styles.statValue}>{totalDonations}</Text>
          <Text style={styles.statLabel}>Total Donations</Text>
        </Card>

        <Card variant="elevated" padding="md" style={styles.statCard}>
          <Text style={styles.statValue}>{totalVolume.toLocaleString()}</Text>
          <Text style={styles.statLabel}>ml Donated</Text>
        </Card>
      </View>

      <Card variant="elevated" padding="md" style={styles.impactCard}>
        <View style={styles.impactContent}>
          <Text style={styles.impactIcon}>❤️</Text>
          <View style={styles.impactText}>
            <Text style={styles.impactValue}>{livesSaved}</Text>
            <Text style={styles.impactLabel}>Lives Potentially Saved</Text>
          </View>
        </View>
      </Card>

      {nextEligibleDate && (
        <Card variant="elevated" padding="md" style={styles.nextCard}>
          <Text style={styles.nextLabel}>Next Eligible Donation</Text>
          <Text style={styles.nextDate}>{formatDate(nextEligibleDate)}</Text>
          {daysUntil !== null && (
            <Text style={styles.nextDays}>
              {daysUntil > 0
                ? `in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`
                : 'Eligible now!'}
            </Text>
          )}
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Sizes.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Sizes.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Sizes.spacing.xs,
  },
  statLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  impactCard: {
    backgroundColor: Colors.successLight + '20',
  },
  impactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactIcon: {
    fontSize: Sizes.iconSize.xl,
    marginRight: Sizes.spacing.md,
  },
  impactText: {
    flex: 1,
  },
  impactValue: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: '700',
    color: Colors.successDark,
    marginBottom: Sizes.spacing.xs / 2,
  },
  impactLabel: {
    fontSize: Sizes.fontSize.md,
    color: Colors.successDark,
    fontWeight: '600',
  },
  nextCard: {
    backgroundColor: Colors.infoLight + '20',
  },
  nextLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.infoDark,
    fontWeight: '600',
    marginBottom: Sizes.spacing.xs,
  },
  nextDate: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '700',
    color: Colors.infoDark,
    marginBottom: Sizes.spacing.xs / 2,
  },
  nextDays: {
    fontSize: Sizes.fontSize.md,
    color: Colors.infoDark,
  },
});
