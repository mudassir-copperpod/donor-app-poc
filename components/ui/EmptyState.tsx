import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && (
        <View style={styles.iconContainer}>
          {typeof icon === 'string' ? <Text style={styles.icon}>{icon}</Text> : icon}
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {description && <Text style={styles.description}>{description}</Text>}
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.spacing.xl,
  },
  iconContainer: {
    marginBottom: Sizes.spacing.lg,
    opacity: 0.5,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Sizes.spacing.sm,
  },
  description: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Sizes.fontSize.md * Sizes.lineHeight.relaxed,
    marginBottom: Sizes.spacing.lg,
  },
  button: {
    marginTop: Sizes.spacing.md,
  },
});
