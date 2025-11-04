import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '@/types/appointment.types';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface AppointmentCardProps {
  appointment: Appointment;
  petName?: string;
  facilityName?: string;
  onPress?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  petName,
  facilityName,
  onPress,
  onReschedule,
  onCancel,
  showActions = false,
}) => {
  const getStatusVariant = () => {
    switch (appointment.status) {
      case 'SCHEDULED':
        return 'info';
      case 'CONFIRMED':
        return 'success';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'NO_SHOW':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusLabel = () => {
    switch (appointment.status) {
      case 'SCHEDULED':
        return 'Scheduled';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'NO_SHOW':
        return 'No Show';
      default:
        return 'Unknown';
    }
  };

  const getTypeLabel = () => {
    switch (appointment.type) {
      case 'ROUTINE':
        return 'Routine Donation';
      case 'EMERGENCY':
        return 'Emergency Donation';
      case 'SCREENING':
        return 'Screening';
      case 'FOLLOWUP':
        return 'Follow-up';
      default:
        return 'Appointment';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const dateStr = date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(appointment.dateTime);
  const canModify = appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED';

  return (
    <Card variant="elevated" padding="md" onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Text style={styles.timeText}>{timeStr}</Text>
          </View>
          <Badge
            label={getStatusLabel()}
            variant={getStatusVariant()}
            size="sm"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.type}>{getTypeLabel()}</Text>
          
          {petName && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Pet:</Text>
              <Text style={styles.value}>{petName}</Text>
            </View>
          )}
          
          {facilityName && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Facility:</Text>
              <Text style={styles.value}>{facilityName}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{appointment.estimatedDuration} min</Text>
          </View>
        </View>

        {appointment.specialInstructions && (
          <View style={styles.instructions}>
            <Text style={styles.instructionsLabel}>Special Instructions:</Text>
            <Text style={styles.instructionsText}>
              {appointment.specialInstructions}
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        {showActions && canModify && (onReschedule || onCancel) && (
          <View style={styles.actions}>
            {onReschedule && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onReschedule();
                }}
              >
                <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Reschedule</Text>
              </TouchableOpacity>
            )}
            {onCancel && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger]}
                onPress={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
              >
                <Ionicons name="close-circle-outline" size={18} color={Colors.error} />
                <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Sizes.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs / 2,
  },
  timeText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    gap: Sizes.spacing.sm,
  },
  type: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginRight: Sizes.spacing.xs,
    minWidth: 70,
  },
  value: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    flex: 1,
  },
  instructions: {
    backgroundColor: Colors.gray50,
    padding: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.md,
  },
  instructionsLabel: {
    fontSize: Sizes.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs / 2,
  },
  instructionsText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    lineHeight: Sizes.fontSize.sm * Sizes.lineHeight.relaxed,
  },
  actions: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
    marginTop: Sizes.spacing.xs,
    paddingTop: Sizes.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.spacing.xs,
    paddingVertical: Sizes.spacing.sm,
    paddingHorizontal: Sizes.spacing.md,
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: Sizes.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  actionButtonDanger: {
    backgroundColor: Colors.errorLight + '20',
    borderColor: Colors.error + '40',
  },
  actionButtonText: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionButtonTextDanger: {
    color: Colors.error,
  },
});
