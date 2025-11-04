import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`button_${size}`],
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? Colors.gray300 : Colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? Colors.gray300 : Colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: Sizes.borderWidth.medium,
          borderColor: isDisabled ? Colors.gray300 : Colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? Colors.gray300 : Colors.error,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...styles[`text_${size}`],
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return {
          ...baseStyle,
          color: isDisabled ? Colors.gray500 : Colors.white,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: isDisabled ? Colors.gray500 : Colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: isDisabled ? Colors.gray500 : Colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.borderRadius.md,
    gap: Sizes.spacing.sm,
  },
  button_sm: {
    paddingVertical: Sizes.spacing.sm,
    paddingHorizontal: Sizes.spacing.md,
    minHeight: 36,
  },
  button_md: {
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.lg,
    minHeight: Sizes.touchTarget,
  },
  button_lg: {
    paddingVertical: Sizes.spacing.lg,
    paddingHorizontal: Sizes.spacing.xl,
    minHeight: 56,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_sm: {
    fontSize: Sizes.fontSize.sm,
  },
  text_md: {
    fontSize: Sizes.fontSize.md,
  },
  text_lg: {
    fontSize: Sizes.fontSize.lg,
  },
});
