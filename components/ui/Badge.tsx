import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'primary' 
  | 'secondary'
  | 'eligible'
  | 'pending'
  | 'ineligible'
  | 'temporaryIneligible'
  | 'reVerificationRequired';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  icon,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
      case 'eligible':
        return Colors.successLight;
      case 'warning':
      case 'pending':
        return Colors.warningLight;
      case 'error':
      case 'ineligible':
        return Colors.errorLight;
      case 'info':
      case 'reVerificationRequired':
        return Colors.infoLight;
      case 'primary':
        return Colors.primaryLight;
      case 'secondary':
        return Colors.secondaryLight;
      case 'temporaryIneligible':
        return Colors.warningLight;
      default:
        return Colors.gray200;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
      case 'eligible':
        return Colors.successDark;
      case 'warning':
      case 'pending':
        return Colors.warningDark;
      case 'error':
      case 'ineligible':
        return Colors.errorDark;
      case 'info':
      case 'reVerificationRequired':
        return Colors.infoDark;
      case 'primary':
        return Colors.primaryDark;
      case 'secondary':
        return Colors.secondaryDark;
      case 'temporaryIneligible':
        return Colors.warningDark;
      default:
        return Colors.gray700;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        styles[`badge_${size}`],
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          styles[`text_${size}`],
          { color: getTextColor() },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Sizes.borderRadius.full,
    gap: Sizes.spacing.xs,
  },
  badge_sm: {
    paddingVertical: Sizes.spacing.xs / 2,
    paddingHorizontal: Sizes.spacing.sm,
  },
  badge_md: {
    paddingVertical: Sizes.spacing.xs,
    paddingHorizontal: Sizes.spacing.md,
  },
  badge_lg: {
    paddingVertical: Sizes.spacing.sm,
    paddingHorizontal: Sizes.spacing.lg,
  },
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: Sizes.fontSize.xs,
  },
  text_md: {
    fontSize: Sizes.fontSize.sm,
  },
  text_lg: {
    fontSize: Sizes.fontSize.md,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
