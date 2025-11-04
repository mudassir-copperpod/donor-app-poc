import { useState, useEffect, useCallback } from 'react';
import { NotificationService, NotificationType } from '../services/notification.service';
import * as Notifications from 'expo-notifications';

interface NotificationsState {
  permissionStatus: 'granted' | 'denied' | 'undetermined';
  isLoading: boolean;
  error: string | null;
}

export const useNotifications = () => {
  const [state, setState] = useState<NotificationsState>({
    permissionStatus: 'undetermined',
    isLoading: false,
    error: null,
  });

  /**
   * Check permission status on mount
   */
  useEffect(() => {
    checkPermissions();
  }, []);

  /**
   * Check notification permissions
   */
  const checkPermissions = useCallback(async () => {
    try {
      const status = await NotificationService.getPermissionStatus();
      setState(prev => ({ ...prev, permissionStatus: status }));
    } catch (error) {
      console.error('Failed to check permissions:', error);
    }
  }, []);

  /**
   * Request notification permissions
   */
  const requestPermissions = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const granted = await NotificationService.requestPermissions();
      
      setState(prev => ({
        ...prev,
        permissionStatus: granted ? 'granted' : 'denied',
        isLoading: false,
        error: granted ? null : 'Notification permissions denied',
      }));
      
      return { success: granted };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request permissions';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Schedule a notification
   */
  const scheduleNotification = useCallback(async (
    title: string,
    body: string,
    trigger: Date | number,
    data?: any,
    type?: NotificationType
  ) => {
    try {
      const notificationId = await NotificationService.scheduleNotification(
        title,
        body,
        trigger,
        data,
        type
      );
      return { success: true, notificationId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to schedule notification';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cancel a notification
   */
  const cancelNotification = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.cancelNotification(notificationId);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel notification';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cancel all notifications
   */
  const cancelAllNotifications = useCallback(async () => {
    try {
      await NotificationService.cancelAllNotifications();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel notifications';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Clear notification badge
   */
  const clearBadge = useCallback(async () => {
    try {
      await NotificationService.clearBadge();
    } catch (error) {
      console.error('Failed to clear badge:', error);
    }
  }, []);

  /**
   * Set badge count
   */
  const setBadgeCount = useCallback(async (count: number) => {
    try {
      await NotificationService.setBadgeCount(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }, []);

  /**
   * Add notification received listener
   */
  const addNotificationListener = useCallback((
    handler: (notification: Notifications.Notification) => void
  ) => {
    return NotificationService.addNotificationReceivedListener(handler);
  }, []);

  /**
   * Add notification response listener (when user taps notification)
   */
  const addNotificationResponseListener = useCallback((
    handler: (response: Notifications.NotificationResponse) => void
  ) => {
    return NotificationService.addNotificationResponseListener(handler);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    permissionStatus: state.permissionStatus,
    isLoading: state.isLoading,
    error: state.error,
    hasPermission: state.permissionStatus === 'granted',
    
    // Methods
    requestPermissions,
    checkPermissions,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    clearBadge,
    setBadgeCount,
    addNotificationListener,
    addNotificationResponseListener,
    clearError,
  };
};
