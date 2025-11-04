import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointment.service';
import { Appointment, AppointmentStatus, AppointmentType } from '../types/appointment.types';
import { useAuth } from './useAuth';

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  selectedAppointment: Appointment | null;
}

export const useAppointments = (userIdProp?: string) => {
  const { user } = useAuth();
  const userId = userIdProp || user?.userId;
  
  const [state, setState] = useState<AppointmentsState>({
    appointments: [],
    isLoading: false,
    error: null,
    selectedAppointment: null,
  });

  /**
   * Load appointments for user
   */
  const loadAppointments = useCallback(async (ownerId?: string) => {
    if (!ownerId && !userId) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const appointments = await appointmentService.getAppointmentsByUser(ownerId || userId!);
      
      setState(prev => ({
        ...prev,
        appointments,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load appointments';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [userId]);

  /**
   * Load appointments on mount
   */
  useEffect(() => {
    if (userId) {
      loadAppointments(userId);
    }
  }, [userId, loadAppointments]);

  /**
   * Get appointment by ID
   */
  const getAppointmentById = useCallback(async (appointmentId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const appointment = await appointmentService.getAppointmentById(appointmentId);
      
      if (appointment) {
        setState(prev => ({
          ...prev,
          selectedAppointment: appointment,
          isLoading: false,
          error: null,
        }));
        return { success: true, appointment };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Appointment not found',
        }));
        return { success: false, error: 'Appointment not found' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get appointment';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Book new appointment
   */
  const bookAppointment = useCallback(async (
    petId: string,
    facilityId: string,
    dateTime: string,
    type: AppointmentType
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const appointment = await appointmentService.bookAppointment(petId, facilityId, dateTime, type);
      
      setState(prev => ({
        ...prev,
        appointments: [...prev.appointments, appointment],
        isLoading: false,
        error: null,
      }));
      
      return { success: true, appointment };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book appointment';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Cancel appointment
   */
  const cancelAppointment = useCallback(async (appointmentId: string, reason: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await appointmentService.cancelAppointment(appointmentId, reason);
      
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(a => 
          a.appointmentId === appointmentId 
            ? { ...a, status: AppointmentStatus.CANCELLED, cancellationReason: reason }
            : a
        ),
        isLoading: false,
        error: null,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel appointment';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Reschedule appointment
   */
  const rescheduleAppointment = useCallback(async (
    appointmentId: string,
    newDateTime: string
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const updatedAppointment = await appointmentService.rescheduleAppointment(appointmentId, newDateTime);
      
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(a => 
          a.appointmentId === appointmentId ? updatedAppointment : a
        ),
        selectedAppointment: prev.selectedAppointment?.appointmentId === appointmentId 
          ? updatedAppointment 
          : prev.selectedAppointment,
        isLoading: false,
        error: null,
      }));
      
      return { success: true, appointment: updatedAppointment };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reschedule appointment';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Get upcoming appointments
   */
  const getUpcomingAppointments = useCallback(() => {
    const now = new Date();
    return state.appointments
      .filter(a => 
        new Date(a.dateTime) > now && 
        a.status !== AppointmentStatus.CANCELLED
      )
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [state.appointments]);

  /**
   * Get past appointments
   */
  const getPastAppointments = useCallback(() => {
    const now = new Date();
    return state.appointments
      .filter(a => new Date(a.dateTime) <= now || a.status === AppointmentStatus.COMPLETED)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [state.appointments]);

  /**
   * Get appointments by status
   */
  const getAppointmentsByStatus = useCallback((status: AppointmentStatus) => {
    return state.appointments.filter(a => a.status === status);
  }, [state.appointments]);

  /**
   * Get next appointment
   */
  const getNextAppointment = useCallback(() => {
    const upcoming = getUpcomingAppointments();
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [getUpcomingAppointments]);

  /**
   * Select appointment
   */
  const selectAppointment = useCallback((appointment: Appointment | null) => {
    setState(prev => ({ ...prev, selectedAppointment: appointment }));
  }, []);

  /**
   * Refresh appointments
   */
  const refresh = useCallback(() => {
    if (userId) {
      loadAppointments(userId);
    }
  }, [userId, loadAppointments]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    appointments: state.appointments,
    isLoading: state.isLoading,
    error: state.error,
    selectedAppointment: state.selectedAppointment,
    
    // Methods
    loadAppointments,
    getAppointmentById,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    selectAppointment,
    
    // Utility methods
    getUpcomingAppointments,
    getPastAppointments,
    getAppointmentsByStatus,
    getNextAppointment,
    refresh,
    clearError,
  };
};
