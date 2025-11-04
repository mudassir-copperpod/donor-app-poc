import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Species } from '@/types/pet.types';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface PetAvatarProps {
  photoUrl?: string;
  species: Species;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const PetAvatar: React.FC<PetAvatarProps> = ({
  photoUrl,
  species,
  size = 'md',
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 40;
      case 'md':
        return 60;
      case 'lg':
        return 80;
      case 'xl':
        return 120;
      default:
        return 60;
    }
  };

  const getSpeciesIcon = () => {
    switch (species) {
      case 'DOG':
        return '🐕';
      case 'CAT':
        return '🐱';
      case 'HORSE':
        return '🐴';
      default:
        return '🐾';
    }
  };

  const getSpeciesColor = () => {
    switch (species) {
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

  const avatarSize = getSize();
  const iconSize = avatarSize * 0.5;

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
        style,
      ]}
    >
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: getSpeciesColor() + '30',
            },
          ]}
        >
          <Text style={{ fontSize: iconSize }}>{getSpeciesIcon()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: Colors.gray200,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
