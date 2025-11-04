import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

export interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label?: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  onSelect: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  options,
  placeholder = 'Select an option',
  onSelect,
  error,
  required = false,
  disabled = false,
  containerStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  const getBorderColor = () => {
    if (error) return Colors.error;
    return Colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.selectButton,
          { borderColor: getBorderColor() },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.selectText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: Sizes.borderWidth.thin,
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
    minHeight: Sizes.touchTarget,
  },
  disabled: {
    backgroundColor: Colors.gray100,
    opacity: 0.6,
  },
  selectText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
    flex: 1,
  },
  placeholderText: {
    color: Colors.gray500,
  },
  arrow: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.gray600,
    marginLeft: Sizes.spacing.sm,
  },
  errorText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.error,
    marginTop: Sizes.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Sizes.spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.xl,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizes.spacing.md,
    borderBottomWidth: Sizes.borderWidth.thin,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    fontSize: Sizes.fontSize.xxl,
    color: Colors.gray600,
    fontWeight: '300',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizes.spacing.md,
    borderBottomWidth: Sizes.borderWidth.thin,
    borderBottomColor: Colors.borderLight,
  },
  selectedOption: {
    backgroundColor: Colors.primaryLight + '20',
  },
  optionText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.primary,
    fontWeight: '700',
  },
});
