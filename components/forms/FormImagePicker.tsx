import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface FormImagePickerProps {
  label?: string;
  value?: string;
  onChange: (uri: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  allowsEditing?: boolean;
  aspect?: [number, number];
  containerStyle?: ViewStyle;
}

export const FormImagePicker: React.FC<FormImagePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select an image',
  error,
  required = false,
  disabled = false,
  allowsEditing = true,
  aspect = [1, 1],
  containerStyle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to select images.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (disabled) return;

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    if (disabled) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take photos.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing,
        aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsLoading(false);
    }
  };

  const showOptions = () => {
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value }} style={styles.image} />
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={showOptions}
              disabled={disabled}
            >
              <Text style={styles.actionText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={removeImage}
              disabled={disabled}
            >
              <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.pickerButton,
            error && styles.pickerButtonError,
            disabled && styles.disabled,
          ]}
          onPress={showOptions}
          disabled={disabled || isLoading}
        >
          <Text style={styles.icon}>📷</Text>
          <Text style={styles.placeholderText}>
            {isLoading ? 'Loading...' : placeholder}
          </Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.spacing.md,
  },
  label: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  required: {
    color: Colors.error,
  },
  pickerButton: {
    borderWidth: Sizes.borderWidth.thin,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.gray50,
    paddingVertical: Sizes.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerButtonError: {
    borderColor: Colors.error,
  },
  disabled: {
    opacity: 0.6,
  },
  icon: {
    fontSize: Sizes.iconSize.xl,
    marginBottom: Sizes.spacing.sm,
  },
  placeholderText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.gray500,
  },
  imageContainer: {
    borderRadius: Sizes.borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.gray200,
  },
  imageActions: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
    marginTop: Sizes.spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Sizes.spacing.sm,
    paddingHorizontal: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: Colors.error,
  },
  actionText: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.white,
  },
  removeText: {
    color: Colors.white,
  },
  errorText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.error,
    marginTop: Sizes.spacing.xs,
  },
});
