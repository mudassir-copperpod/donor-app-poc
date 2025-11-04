import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Pet } from '@/types/pet.types';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
  showEligibility?: boolean;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onPress,
  showEligibility = true,
}) => {
  const getEligibilityVariant = () => {
    switch (pet.eligibilityStatus) {
      case 'ELIGIBLE':
        return 'eligible';
      case 'PENDING_REVIEW':
        return 'pending';
      case 'TEMPORARILY_INELIGIBLE':
        return 'temporaryIneligible';
      case 'INELIGIBLE':
        return 'ineligible';
      case 'RE_VERIFICATION_REQUIRED':
        return 'reVerificationRequired';
      default:
        return 'pending';
    }
  };

  const getEligibilityLabel = () => {
    switch (pet.eligibilityStatus) {
      case 'ELIGIBLE':
        return 'Eligible';
      case 'PENDING_REVIEW':
        return 'Pending Review';
      case 'TEMPORARILY_INELIGIBLE':
        return 'Temporarily Ineligible';
      case 'INELIGIBLE':
        return 'Ineligible';
      case 'RE_VERIFICATION_REQUIRED':
        return 'Re-verification Required';
      default:
        return 'Unknown';
    }
  };

  const getSpeciesColor = () => {
    switch (pet.species) {
      case 'DOG':
        return Colors.dog;
      case 'CAT':
        return Colors.cat;
      case 'HORSE':
        return Colors.horse;
      default:
        return Colors.gray500;
    }
  };

  return (
    <Card variant="elevated" padding="md" onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: pet.photoUrl }}
            style={styles.image}
            defaultSource={require('@/assets/icon.png')}
          />
          <View
            style={[
              styles.speciesBadge,
              { backgroundColor: getSpeciesColor() },
            ]}
          >
            <Text style={styles.speciesText}>
              {pet.species === 'DOG' ? '🐕' : pet.species === 'CAT' ? '🐱' : '🐴'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.breed}>{pet.breed}</Text>
          
          <View style={styles.details}>
            <Text style={styles.detailText}>
              {pet.age} {pet.age === 1 ? 'year' : 'years'} old
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.detailText}>{pet.currentWeight} lbs</Text>
          </View>

          {showEligibility && (
            <View style={styles.eligibilityContainer}>
              <Badge
                label={getEligibilityLabel()}
                variant={getEligibilityVariant()}
                size="sm"
              />
            </View>
          )}
        </View>

        {onPress && (
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: Sizes.spacing.md,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: Sizes.borderRadius.lg,
    backgroundColor: Colors.gray200,
  },
  speciesBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: Sizes.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  speciesText: {
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs / 2,
  },
  breed: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.spacing.sm,
  },
  detailText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.textSecondary,
  },
  separator: {
    marginHorizontal: Sizes.spacing.xs,
    color: Colors.textTertiary,
  },
  eligibilityContainer: {
    marginTop: Sizes.spacing.xs,
  },
  arrow: {
    marginLeft: Sizes.spacing.sm,
  },
  arrowText: {
    fontSize: Sizes.fontSize.xxl,
    color: Colors.gray400,
    fontWeight: '300',
  },
});
