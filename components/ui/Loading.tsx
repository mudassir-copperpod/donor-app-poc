import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = Colors.primary,
  text,
  fullScreen = false,
  style,
}) => {
  if (fullScreen) {
    return (
      <View style={[styles.fullScreenContainer, style]}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

// Skeleton loader for content placeholders
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = Sizes.borderRadius.sm,
  style,
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
};

// Skeleton card for list items
export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonCardHeader}>
        <Skeleton width={60} height={60} borderRadius={Sizes.borderRadius.full} />
        <View style={styles.skeletonCardInfo}>
          <Skeleton width="80%" height={16} />
          <Skeleton width="60%" height={14} style={{ marginTop: Sizes.spacing.xs }} />
        </View>
      </View>
      <Skeleton width="100%" height={12} style={{ marginTop: Sizes.spacing.md }} />
      <Skeleton width="90%" height={12} style={{ marginTop: Sizes.spacing.xs }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Sizes.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: Sizes.spacing.md,
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
  },
  skeleton: {
    backgroundColor: Colors.gray200,
  },
  skeletonCard: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.lg,
    padding: Sizes.spacing.md,
    marginBottom: Sizes.spacing.md,
  },
  skeletonCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonCardInfo: {
    flex: 1,
    marginLeft: Sizes.spacing.md,
  },
});
