import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Appointment } from '../types/appointment.types';
import { storageService } from './storage.service';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export enum NotificationType {
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  ELIGIBILITY_RENEWAL = 'ELIGIBILITY_RENEWAL',
  CONSENT_RENEWAL = 'CONSENT_RENEWAL',
  DONATION_THANK_YOU = 'DONATION_THANK_YOU',
  EMERGENCY_ALERT = 'EMERGENCY_ALERT',
  GENERAL = 'GENERAL',
}

interface ScheduledNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
  trigger: Date | number;
  scheduledAt: string;
}

const STORAGE_KEY = 'scheduled_notifications';

class NotificationServiceClass {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule a notification
   */
  async scheduleNotification(
    title: string,
    body: string,
    trigger: Date | number,
    data?: any,
    type: NotificationType = NotificationType.GENERAL
  ): Promise<string> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Notification permissions not granted');
      }

      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { ...data, type },
          sound: true,
        },
        trigger:
          trigger instanceof Date
            ? { type: 'date' as const, date: trigger }
            : { type: 'timeInterval' as const, seconds: trigger },
      });

      // Save scheduled notification info
      await this.saveScheduledNotification({
        id: notificationId,
        type,
        title,
        body,
        data,
        trigger,
        scheduledAt: new Date().toISOString(),
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Schedule appointment reminders (48hr, 24hr, 2hr before)
   */
  async scheduleAppointmentReminders(appointment: Appointment): Promise<string[]> {
    try {
      const appointmentDate = new Date(appointment.dateTime);
      const now = new Date();
      const notificationIds: string[] = [];

      // 48 hour reminder
      const reminder48h = new Date(appointmentDate.getTime() - 48 * 60 * 60 * 1000);
      if (reminder48h > now) {
        const id = await this.scheduleNotification(
          'Appointment Reminder',
          `Your pet's donation appointment is in 2 days`,
          reminder48h,
          { appointmentId: appointment.appointmentId },
          NotificationType.APPOINTMENT_REMINDER
        );
        notificationIds.push(id);
      }

      // 24 hour reminder
      const reminder24h = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
      if (reminder24h > now) {
        const id = await this.scheduleNotification(
          'Appointment Tomorrow',
          `Don't forget: Your pet's donation appointment is tomorrow`,
          reminder24h,
          { appointmentId: appointment.appointmentId },
          NotificationType.APPOINTMENT_REMINDER
        );
        notificationIds.push(id);
      }

      // 2 hour reminder
      const reminder2h = new Date(appointmentDate.getTime() - 2 * 60 * 60 * 1000);
      if (reminder2h > now) {
        const id = await this.scheduleNotification(
          'Appointment Today',
          `Your pet's donation appointment is in 2 hours. Time to head to the facility!`,
          reminder2h,
          { appointmentId: appointment.appointmentId },
          NotificationType.APPOINTMENT_REMINDER
        );
        notificationIds.push(id);
      }

      return notificationIds;
    } catch (error) {
      console.error('Error scheduling appointment reminders:', error);
      return [];
    }
  }

  /**
   * Schedule eligibility renewal reminder
   */
  async scheduleEligibilityRenewal(
    petId: string,
    petName: string,
    renewalDate: Date
  ): Promise<string> {
    try {
      // Schedule reminder 30 days before renewal
      const reminderDate = new Date(renewalDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      return await this.scheduleNotification(
        'Eligibility Renewal Needed',
        `${petName}'s donor eligibility needs to be renewed. Please complete the questionnaire.`,
        reminderDate,
        { petId },
        NotificationType.ELIGIBILITY_RENEWAL
      );
    } catch (error) {
      console.error('Error scheduling eligibility renewal:', error);
      throw error;
    }
  }

  /**
   * Schedule consent renewal reminder
   */
  async scheduleConsentRenewal(
    petId: string,
    petName: string,
    expirationDate: Date
  ): Promise<string> {
    try {
      // Schedule reminder 30 days before expiration
      const reminderDate = new Date(expirationDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      return await this.scheduleNotification(
        'Consent Renewal Required',
        `${petName}'s donation consent will expire soon. Please renew to continue donating.`,
        reminderDate,
        { petId },
        NotificationType.CONSENT_RENEWAL
      );
    } catch (error) {
      console.error('Error scheduling consent renewal:', error);
      throw error;
    }
  }

  /**
   * Send thank you notification after donation
   */
  async sendDonationThankYou(petName: string, livesImpacted: number): Promise<void> {
    try {
      await this.scheduleNotification(
        'Thank You for Donating!',
        `${petName}'s donation could help save up to ${livesImpacted} lives. You're making a difference!`,
        5, // 5 seconds delay
        {},
        NotificationType.DONATION_THANK_YOU
      );
    } catch (error) {
      console.error('Error sending donation thank you:', error);
    }
  }

  /**
   * Send emergency blood need alert
   */
  async sendEmergencyAlert(
    species: string,
    bloodType: string,
    facilityName: string,
    urgency: 'HIGH' | 'CRITICAL'
  ): Promise<void> {
    try {
      const urgencyText = urgency === 'CRITICAL' ? '🚨 CRITICAL' : '⚠️ URGENT';
      
      await this.scheduleNotification(
        `${urgencyText} Blood Need`,
        `${facilityName} urgently needs ${species} blood (${bloodType}). Can your pet help?`,
        1, // Immediate
        { species, bloodType, facilityName, urgency },
        NotificationType.EMERGENCY_ALERT
      );
    } catch (error) {
      console.error('Error sending emergency alert:', error);
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await this.removeScheduledNotification(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Cancel all notifications for an appointment
   */
  async cancelAppointmentNotifications(appointmentId: string): Promise<void> {
    try {
      const scheduled = await this.getScheduledNotifications();
      const appointmentNotifications = scheduled.filter(
        n => n.data?.appointmentId === appointmentId
      );

      for (const notification of appointmentNotifications) {
        await this.cancelNotification(notification.id);
      }
    } catch (error) {
      console.error('Error canceling appointment notifications:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await storageService.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const notificationsJson = await storageService.getItem(STORAGE_KEY);
      return notificationsJson ? JSON.parse(notificationsJson) : [];
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Get notification history (delivered notifications)
   */
  async getNotificationHistory(): Promise<Notifications.Notification[]> {
    try {
      return await Notifications.getPresentedNotificationsAsync();
    } catch (error) {
      console.error('Error getting notification history:', error);
      return [];
    }
  }

  /**
   * Clear notification badge
   */
  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  }

  /**
   * Set notification badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  /**
   * Save scheduled notification info
   */
  private async saveScheduledNotification(notification: ScheduledNotification): Promise<void> {
    try {
      const notifications = await this.getScheduledNotifications();
      notifications.push(notification);
      await storageService.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving scheduled notification:', error);
    }
  }

  /**
   * Remove scheduled notification info
   */
  private async removeScheduledNotification(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getScheduledNotifications();
      const filtered = notifications.filter(n => n.id !== notificationId);
      await storageService.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing scheduled notification:', error);
    }
  }

  /**
   * Check notification permissions status
   */
  async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error getting permission status:', error);
      return 'undetermined';
    }
  }

  /**
   * Add notification received listener
   */
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Add notification response listener (when user taps notification)
   */
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
}

export const NotificationService = new NotificationServiceClass();
