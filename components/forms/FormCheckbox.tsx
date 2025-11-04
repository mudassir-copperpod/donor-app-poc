import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface FormCheckboxProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => !disabled && onChange(!value)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            value && styles.checkboxChecked,
            error && styles.checkboxError,
            disabled && styles.disabled,
          ]}
        >
          {value && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: Sizes.borderWidth.medium,
    borderColor: Colors.border,
    borderRadius: Sizes.borderRadius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizes.spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxError: {
    borderColor: Colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: Colors.white,
    fontSize: Sizes.fontSize.md,
    fontWeight: '700',
  },
  label: {
    flex: 1,
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
    lineHeight: Sizes.fontSize.md * Sizes.lineHeight.relaxed,
  },
  labelDisabled: {
    color: Colors.gray500,
  },
  errorText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.error,
    marginTop: Sizes.spacing.xs,
    marginLeft: 32,
  },
});
