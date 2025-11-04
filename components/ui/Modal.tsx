import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type ModalVariant = 'bottom-sheet' | 'center' | 'full-screen';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: ModalVariant;
  showCloseButton?: boolean;
  containerStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  variant = 'center',
  showCloseButton = true,
  containerStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'bottom-sheet':
        return styles.bottomSheetContainer;
      case 'full-screen':
        return styles.fullScreenContainer;
      default:
        return styles.centerContainer;
    }
  };

  const getContentStyle = (): ViewStyle => {
    switch (variant) {
      case 'bottom-sheet':
        return styles.bottomSheetContent;
      case 'full-screen':
        return styles.fullScreenContent;
      default:
        return styles.centerContent;
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent={variant !== 'full-screen'}
      animationType={variant === 'bottom-sheet' ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, getContainerStyle()]}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={variant !== 'full-screen' ? onClose : undefined}
        />
        
        <View style={[getContentStyle(), containerStyle]}>
          {variant === 'bottom-sheet' && (
            <View style={styles.handle} />
          )}
          
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.spacing.lg,
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  bottomSheetContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Sizes.borderRadius.xxl,
    borderTopRightRadius: Sizes.borderRadius.xxl,
    padding: Sizes.spacing.lg,
    maxHeight: SCREEN_HEIGHT * 0.9,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  fullScreenContent: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray300,
    borderRadius: Sizes.borderRadius.full,
    alignSelf: 'center',
    marginBottom: Sizes.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.spacing.md,
  },
  title: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  closeButton: {
    padding: Sizes.spacing.sm,
    marginLeft: Sizes.spacing.md,
  },
  closeText: {
    fontSize: Sizes.fontSize.xxl,
    color: Colors.gray600,
    fontWeight: '300',
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: Sizes.spacing.lg,
  },
});
