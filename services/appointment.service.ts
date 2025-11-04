import { Appointment, AppointmentType, AppointmentStatus } from '../types';
import { mockAppointments, getUpcomingAppointments, getPastAppointments } from '../data';
import { petService } from './pet.service';

export interface BookAppointmentData {
  petId: string;
  facilityId: string;
  dateTime: string;
  type: AppointmentType;
  specialInstructions?: string;
}

/**
 * Appointment Service - Handles appointment booking and management
 */
class AppointmentService {
  private appointments: Appointment[] = [...mockAppointments];

  /**
   * Book a new appointment
   */
  async bookAppointment(data: BookAppointmentData): Promise<Appointment> {
    await this.delay(600);

    const newAppointment: Appointment = {
      appointmentId: `appt-${Date.now()}`,
      petId: data.petId,
      facilityId: data.facilityId,
      dateTime: data.dateTime,
      type: data.type,
      status: AppointmentStatus.SCHEDULED,
      remindersSent: [],
      preInstructionsSent: false,
      estimatedDuration: data.type === AppointmentType.ROUTINE ? 45 : 60,
      specialInstructions: data.specialInstructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.appointments.push(newAppointment);
    return newAppointment;
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
    await this.delay(200);
    const appointment = this.appointments.find(a => a.appointmentId === appointmentId);
    return appointment || null;
  }

  /**
   * Get all appointments for a user (across all their pets)
   */
  async getAppointmentsByUser(userId: string): Promise<Appointment[]> {
    await this.delay(300);
    
    // Get all pets owned by this user
    const userPets = await petService.getPetsByOwner(userId);
    const userPetIds = userPets.map(pet => pet.petId);
    
    // Filter appointments for user's pets
    return this.appointments
      .filter(a => userPetIds.includes(a.petId))
      .sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }

  /**
   * Get appointments for a specific pet
   */
  async getAppointmentsByPet(petId: string): Promise<Appointment[]> {
    await this.delay(300);
    return this.appointments
      .filter(a => a.petId === petId)
      .sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(petId?: string): Promise<Appointment[]> {
    await this.delay(300);
    const now = new Date().toISOString();
    
    let upcoming = this.appointments.filter(
      a => 
        a.dateTime > now &&
        (a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.CONFIRMED)
    );

    if (petId) {
      upcoming = upcoming.filter(a => a.petId === petId);
    }

    return upcoming.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  }

  /**
   * Get past appointments
   */
  async getPastAppointments(petId?: string): Promise<Appointment[]> {
    await this.delay(300);
    const now = new Date().toISOString();
    
    let past = this.appointments.filter(
      a => a.dateTime < now || a.status === AppointmentStatus.COMPLETED
    );

    if (petId) {
      past = past.filter(a => a.petId === petId);
    }

    return past.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(
    appointmentId: string,
    cancelledBy: string,
    reason?: string
  ): Promise<Appointment | null> {
    await this.delay(400);

    const index = this.appointments.findIndex(a => a.appointmentId === appointmentId);
    if (index === -1) {
      return null;
    }

    const updatedAppointment: Appointment = {
      ...this.appointments[index],
      status: AppointmentStatus.CANCELLED,
      cancelledBy,
      cancellationReason: reason,
      updatedAt: new Date().toISOString(),
    };

    this.appointments[index] = updatedAppointment;
    return updatedAppointment;
  }

  /**
   * Reschedule an appointment
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDateTime: string
  ): Promise<Appointment | null> {
    await this.delay(500);

    const index = this.appointments.findIndex(a => a.appointmentId === appointmentId);
    if (index === -1) {
      return null;
    }

    const updatedAppointment: Appointment = {
      ...this.appointments[index],
      dateTime: newDateTime,
      status: AppointmentStatus.SCHEDULED,
      remindersSent: [],
      updatedAt: new Date().toISOString(),
    };

    this.appointments[index] = updatedAppointment;
    return updatedAppointment;
  }

  /**
   * Confirm an appointment
   */
  async confirmAppointment(appointmentId: string): Promise<Appointment | null> {
    await this.delay(300);

    const index = this.appointments.findIndex(a => a.appointmentId === appointmentId);
    if (index === -1) {
      return null;
    }

    const updatedAppointment: Appointment = {
      ...this.appointments[index],
      status: AppointmentStatus.CONFIRMED,
      updatedAt: new Date().toISOString(),
    };

    this.appointments[index] = updatedAppointment;
    return updatedAppointment;
  }

  /**
   * Check in for an appointment
   */
  async checkIn(appointmentId: string): Promise<Appointment | null> {
    await this.delay(300);

    const index = this.appointments.findIndex(a => a.appointmentId === appointmentId);
    if (index === -1) {
      return null;
    }

    const updatedAppointment: Appointment = {
      ...this.appointments[index],
      checkInTime: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.appointments[index] = updatedAppointment;
    return updatedAppointment;
  }

  /**
   * Complete an appointment
   */
  async completeAppointment(appointmentId: string): Promise<Appointment | null> {
    await this.delay(300);

    const index = this.appointments.findIndex(a => a.appointmentId === appointmentId);
    if (index === -1) {
      return null;
    }

    const updatedAppointment: Appointment = {
      ...this.appointments[index],
      status: AppointmentStatus.COMPLETED,
      completedTime: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.appointments[index] = updatedAppointment;
    return updatedAppointment;
  }

  /**
   * Get available time slots for a facility
   */
  async getAvailableSlots(facilityId: string, date: string): Promise<string[]> {
    await this.delay(400);

    // Mock available slots (9 AM to 5 PM, hourly)
    const slots: string[] = [];
    const baseDate = new Date(date);
    
    for (let hour = 9; hour < 17; hour++) {
      const slotTime = new Date(baseDate);
      slotTime.setHours(hour, 0, 0, 0);
      slots.push(slotTime.toISOString());
    }

    // Filter out already booked slots
    const bookedSlots = this.appointments
      .filter(a => 
        a.facilityId === facilityId &&
        a.dateTime.startsWith(date) &&
        a.status !== AppointmentStatus.CANCELLED
      )
      .map(a => a.dateTime);

    return slots.filter(slot => !bookedSlots.includes(slot));
  }

  /**
   * Send appointment reminder
   */
  async sendReminder(appointmentId: string): Promise<boolean> {
    await this.delay(200);

    const index = this.appointments.findIndex(a => a.appointmentId === appointmentId);
    if (index === -1) {
      return false;
    }

    const updatedAppointment: Appointment = {
      ...this.appointments[index],
      remindersSent: [
        ...this.appointments[index].remindersSent,
        new Date().toISOString(),
      ],
      updatedAt: new Date().toISOString(),
    };

    this.appointments[index] = updatedAppointment;
    return true;
  }

  // Helper methods

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const appointmentService = new AppointmentService();
