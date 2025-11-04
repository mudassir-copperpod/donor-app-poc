import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface FormDatePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: ViewStyle;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  value,
  onChange,
  mode = 'date',
  placeholder = 'Select date',
  error,
  required = false,
  disabled = false,
  minimumDate,
  maximumDate,
  containerStyle,
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    if (mode === 'time') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (mode === 'datetime') {
      return date.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
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
          styles.dateButton,
          { borderColor: getBorderColor() },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dateText,
            !value && styles.placeholderText,
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
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
  dateButton: {
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
  dateText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
    flex: 1,
  },
  placeholderText: {
    color: Colors.gray500,
  },
  icon: {
    fontSize: Sizes.fontSize.lg,
    marginLeft: Sizes.spacing.sm,
  },
  errorText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.error,
    marginTop: Sizes.spacing.xs,
  },
});
