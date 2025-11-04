import { Appointment, AppointmentType, AppointmentStatus } from '../types';

export const mockAppointments: Appointment[] = [
  // Upcoming appointments
  {
    appointmentId: 'appt-001',
    petId: 'pet-001',
    facilityId: 'facility-001',
    dateTime: '2025-11-10T10:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.CONFIRMED,
    remindersSent: ['2025-11-08T10:00:00Z'],
    preInstructionsSent: true,
    estimatedDuration: 45,
    specialInstructions: 'Please ensure Max has eaten a full meal 2-3 hours before appointment',
    createdAt: '2025-10-25T14:00:00Z',
    updatedAt: '2025-11-08T10:00:00Z',
  },
  {
    appointmentId: 'appt-002',
    petId: 'pet-003',
    facilityId: 'facility-002',
    dateTime: '2025-11-12T14:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.SCHEDULED,
    remindersSent: [],
    preInstructionsSent: false,
    estimatedDuration: 45,
    createdAt: '2025-10-28T09:00:00Z',
    updatedAt: '2025-10-28T09:00:00Z',
  },
  {
    appointmentId: 'appt-003',
    petId: 'pet-009',
    facilityId: 'facility-001',
    dateTime: '2025-11-15T11:30:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.CONFIRMED,
    remindersSent: [],
    preInstructionsSent: false,
    estimatedDuration: 30,
    specialInstructions: 'Cat donation - sedation will be used',
    createdAt: '2025-10-30T10:00:00Z',
    updatedAt: '2025-10-30T10:00:00Z',
  },
  {
    appointmentId: 'appt-004',
    petId: 'pet-014',
    facilityId: 'facility-006',
    dateTime: '2025-11-18T09:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.SCHEDULED,
    remindersSent: [],
    preInstructionsSent: false,
    estimatedDuration: 60,
    specialInstructions: 'Horse donation - large volume collection',
    createdAt: '2025-11-01T15:00:00Z',
    updatedAt: '2025-11-01T15:00:00Z',
  },
  {
    appointmentId: 'appt-005',
    petId: 'pet-005',
    facilityId: 'facility-003',
    dateTime: '2025-11-20T13:00:00Z',
    type: AppointmentType.EMERGENCY,
    status: AppointmentStatus.CONFIRMED,
    remindersSent: [],
    preInstructionsSent: true,
    estimatedDuration: 45,
    specialInstructions: 'Emergency need for universal donor blood',
    createdAt: '2025-11-02T16:30:00Z',
    updatedAt: '2025-11-02T16:30:00Z',
  },

  // Past completed appointments
  {
    appointmentId: 'appt-006',
    petId: 'pet-001',
    facilityId: 'facility-001',
    dateTime: '2025-08-15T10:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.COMPLETED,
    remindersSent: ['2025-08-13T10:00:00Z', '2025-08-14T10:00:00Z', '2025-08-15T08:00:00Z'],
    preInstructionsSent: true,
    checkInTime: '2025-08-15T09:45:00Z',
    completedTime: '2025-08-15T10:42:00Z',
    estimatedDuration: 45,
    createdAt: '2025-07-30T14:00:00Z',
    updatedAt: '2025-08-15T10:42:00Z',
  },
  {
    appointmentId: 'appt-007',
    petId: 'pet-002',
    facilityId: 'facility-001',
    dateTime: '2025-07-10T14:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.COMPLETED,
    remindersSent: ['2025-07-08T14:00:00Z', '2025-07-09T14:00:00Z', '2025-07-10T12:00:00Z'],
    preInstructionsSent: true,
    checkInTime: '2025-07-10T13:50:00Z',
    completedTime: '2025-07-10T14:38:00Z',
    estimatedDuration: 45,
    createdAt: '2025-06-25T10:00:00Z',
    updatedAt: '2025-07-10T14:38:00Z',
  },
  {
    appointmentId: 'appt-008',
    petId: 'pet-003',
    facilityId: 'facility-002',
    dateTime: '2025-06-20T11:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.COMPLETED,
    remindersSent: ['2025-06-18T11:00:00Z', '2025-06-19T11:00:00Z', '2025-06-20T09:00:00Z'],
    preInstructionsSent: true,
    checkInTime: '2025-06-20T10:55:00Z',
    completedTime: '2025-06-20T11:40:00Z',
    estimatedDuration: 45,
    createdAt: '2025-06-05T09:00:00Z',
    updatedAt: '2025-06-20T11:40:00Z',
  },
  {
    appointmentId: 'appt-009',
    petId: 'pet-005',
    facilityId: 'facility-003',
    dateTime: '2025-05-15T15:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.COMPLETED,
    remindersSent: ['2025-05-13T15:00:00Z', '2025-05-14T15:00:00Z', '2025-05-15T13:00:00Z'],
    preInstructionsSent: true,
    checkInTime: '2025-05-15T14:50:00Z',
    completedTime: '2025-05-15T15:45:00Z',
    estimatedDuration: 45,
    createdAt: '2025-04-30T12:00:00Z',
    updatedAt: '2025-05-15T15:45:00Z',
  },
  {
    appointmentId: 'appt-010',
    petId: 'pet-006',
    facilityId: 'facility-004',
    dateTime: '2025-04-22T10:30:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.COMPLETED,
    remindersSent: ['2025-04-20T10:30:00Z', '2025-04-21T10:30:00Z', '2025-04-22T08:30:00Z'],
    preInstructionsSent: true,
    checkInTime: '2025-04-22T10:25:00Z',
    completedTime: '2025-04-22T11:15:00Z',
    estimatedDuration: 45,
    createdAt: '2025-04-08T14:00:00Z',
    updatedAt: '2025-04-22T11:15:00Z',
  },
  {
    appointmentId: 'appt-011',
    petId: 'pet-009',
    facilityId: 'facility-001',
    dateTime: '2025-03-18T11:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.COMPLETED,
    remindersSent: ['2025-03-16T11:00:00Z', '2025-03-17T11:00:00Z', '2025-03-18T09:00:00Z'],
    preInstructionsSent: true,
    checkInTime: '2025-03-18T10:55:00Z',
    completedTime: '2025-03-18T11:28:00Z',
    estimatedDuration: 30,
    specialInstructions: 'Cat donation - sedation used',
    createdAt: '2025-03-03T10:00:00Z',
    updatedAt: '2025-03-18T11:28:00Z',
  },
  {
    appointmentId: 'appt-012',
    petId: 'pet-010',
    facilityId: 'facility-002',
    dateTime: '2025-02-14T13:30:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.COMPLETED,
    remindersSent: ['2025-02-12T13:30:00Z', '2025-02-13T13:30:00Z', '2025-02-14T11:30:00Z'],
    preInstructionsSent: true,
    checkInTime: '2025-02-14T13:25:00Z',
    completedTime: '2025-02-14T14:02:00Z',
    estimatedDuration: 30,
    createdAt: '2025-01-30T11:00:00Z',
    updatedAt: '2025-02-14T14:02:00Z',
  },

  // Cancelled appointment
  {
    appointmentId: 'appt-013',
    petId: 'pet-001',
    facilityId: 'facility-001',
    dateTime: '2025-09-20T10:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.CANCELLED,
    remindersSent: ['2025-09-18T10:00:00Z'],
    preInstructionsSent: true,
    cancelledBy: 'user-001',
    cancellationReason: 'Pet not feeling well, rescheduled',
    estimatedDuration: 45,
    createdAt: '2025-09-05T14:00:00Z',
    updatedAt: '2025-09-19T16:30:00Z',
  },

  // No-show appointment
  {
    appointmentId: 'appt-014',
    petId: 'pet-002',
    facilityId: 'facility-001',
    dateTime: '2025-01-25T14:00:00Z',
    type: AppointmentType.ROUTINE,
    status: AppointmentStatus.NO_SHOW,
    remindersSent: ['2025-01-23T14:00:00Z', '2025-01-24T14:00:00Z', '2025-01-25T12:00:00Z'],
    preInstructionsSent: true,
    estimatedDuration: 45,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-25T14:30:00Z',
  },
];

export const getAppointmentById = (appointmentId: string): Appointment | undefined => {
  return mockAppointments.find(appt => appt.appointmentId === appointmentId);
};

export const getAppointmentsByPetId = (petId: string): Appointment[] => {
  return mockAppointments.filter(appt => appt.petId === petId);
};

export const getUpcomingAppointments = (): Appointment[] => {
  const now = new Date().toISOString();
  return mockAppointments.filter(
    appt => 
      appt.dateTime > now && 
      (appt.status === AppointmentStatus.SCHEDULED || appt.status === AppointmentStatus.CONFIRMED)
  ).sort((a, b) => a.dateTime.localeCompare(b.dateTime));
};

export const getPastAppointments = (): Appointment[] => {
  const now = new Date().toISOString();
  return mockAppointments.filter(
    appt => appt.dateTime < now || appt.status === AppointmentStatus.COMPLETED
  ).sort((a, b) => b.dateTime.localeCompare(a.dateTime));
};

export const getAppointmentsByFacilityId = (facilityId: string): Appointment[] => {
  return mockAppointments.filter(appt => appt.facilityId === facilityId);
};
