export enum RelationshipType {
  OWNER = 'OWNER',
  AUTHORIZED_AGENT = 'AUTHORIZED_AGENT',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INCOMPLETE = 'INCOMPLETE',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PhoneNumbers {
  home?: string;
  mobile: string;
}

export interface ContactInfo {
  address: Address;
  phones: PhoneNumbers;
  email: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  emergencyAlerts: boolean;
  appointmentReminders: boolean;
  generalUpdates: boolean;
  radius: number; // in miles
}

export interface User {
  userId: string;
  fullName: string;
  relationship: RelationshipType;
  contactInfo: ContactInfo;
  emergencyContact: EmergencyContact;
  preferences: NotificationPreferences;
  digitalSignature?: string; // Base64 image
  accountStatus: AccountStatus;
  registrationStatus: RegistrationStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
