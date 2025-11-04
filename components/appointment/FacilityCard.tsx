import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Facility } from '@/types/facility.types';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FacilityCardProps {
  facility: Facility;
  distance?: number;
  onPress?: () => void;
  showActions?: boolean;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  distance,
  onPress,
  showActions = false,
}) => {
  const handleCall = () => {
    Linking.openURL(`tel:${facility.contactPhone}`);
  };

  const handleDirections = () => {
    const address = `${facility.address.street}, ${facility.address.city}, ${facility.address.state} ${facility.address.postalCode}`;
    const url = `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const formatHours = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = facility.operatingHours[today as keyof typeof facility.operatingHours];
    
    if (!todayHours || todayHours.closed) {
      return 'Closed today';
    }
    
    return `Open today: ${todayHours.open} - ${todayHours.close}`;
  };

  return (
    <Card variant="elevated" padding="md" onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.name}>{facility.name}</Text>
            {distance !== undefined && (
              <Text style={styles.distance}>{distance.toFixed(1)} mi away</Text>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.address}>
              {facility.address.street}, {facility.address.city}, {facility.address.state}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>📞</Text>
            <Text style={styles.phone}>{facility.contactPhone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>🕐</Text>
            <Text style={styles.hours}>{formatHours()}</Text>
          </View>

          {facility.capabilities.speciesAccepted.length > 0 && (
            <View style={styles.speciesContainer}>
              <Text style={styles.speciesLabel}>Accepts:</Text>
              <View style={styles.speciesList}>
                {facility.capabilities.speciesAccepted.map((species) => (
                  <View key={species} style={styles.speciesBadge}>
                    <Text style={styles.speciesText}>
                      {species === 'DOG' ? '🐕 Dogs' : species === 'CAT' ? '🐱 Cats' : '🐴 Horses'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {showActions && (
          <View style={styles.actions}>
            <Button
              title="Call"
              onPress={handleCall}
              variant="outline"
              size="sm"
              style={styles.actionButton}
            />
            <Button
              title="Directions"
              onPress={handleDirections}
              variant="primary"
              size="sm"
              style={styles.actionButton}
            />
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
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs / 2,
  },
  distance: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    gap: Sizes.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: Sizes.fontSize.md,
    marginRight: Sizes.spacing.sm,
    width: 20,
  },
  address: {
    flex: 1,
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    lineHeight: Sizes.fontSize.sm * Sizes.lineHeight.relaxed,
  },
  phone: {
    flex: 1,
    fontSize: Sizes.fontSize.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  hours: {
    flex: 1,
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  speciesContainer: {
    marginTop: Sizes.spacing.xs,
  },
  speciesLabel: {
    fontSize: Sizes.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  speciesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.xs,
  },
  speciesBadge: {
    backgroundColor: Colors.gray100,
    paddingVertical: Sizes.spacing.xs / 2,
    paddingHorizontal: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.full,
  },
  speciesText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
    marginTop: Sizes.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
