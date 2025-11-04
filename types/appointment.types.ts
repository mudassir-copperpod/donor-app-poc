export enum AppointmentType {
  ROUTINE = 'ROUTINE',
  EMERGENCY = 'EMERGENCY',
  SCREENING = 'SCREENING',
  FOLLOWUP = 'FOLLOWUP',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface PreAppointmentChecklist {
  feedPetFullMeal: boolean;
  ensureHydration: boolean;
  bringVaccinationRecords: boolean;
  bringMedicationsList: boolean;
  noteHealthChanges: boolean;
}

export interface Appointment {
  appointmentId: string;
  petId: string;
  facilityId: string;
  dateTime: string; // ISO date-time
  type: AppointmentType;
  status: AppointmentStatus;
  remindersSent: string[]; // Array of ISO dates
  preInstructionsSent: boolean;
  checkInTime?: string;
  completedTime?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  estimatedDuration: number; // in minutes
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}
