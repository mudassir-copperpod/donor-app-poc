import { Species, BloodType } from './pet.types';

export enum AlertType {
  EMERGENCY = 'EMERGENCY',
  GENERAL_NEED = 'GENERAL_NEED',
  ELIGIBILITY_REMINDER = 'ELIGIBILITY_REMINDER',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  CONSENT_RENEWAL = 'CONSENT_RENEWAL',
  VACCINATION_REMINDER = 'VACCINATION_REMINDER',
  THANK_YOU = 'THANK_YOU',
  PROGRAM_UPDATE = 'PROGRAM_UPDATE',
}

export enum UrgencyLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  FILLED = 'FILLED',
  EXPIRED = 'EXPIRED',
}

export interface Alert {
  alertId: string;
  type: AlertType;
  facilityId?: string;
  bloodTypeNeeded?: BloodType;
  species?: Species;
  urgencyLevel: UrgencyLevel;
  radius: number; // in miles
  message: string;
  title: string;
  createdAt: string;
  expiresAt?: string;
  status: AlertStatus;
  recipientCount: number;
  responseCount: number;
}
