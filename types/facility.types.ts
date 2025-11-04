import { Address } from './user.types';
import { Species, BloodType } from './pet.types';

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  UNVERIFIED = 'UNVERIFIED',
}

export interface OperatingHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
}

export interface EmergencyHours {
  available24_7: boolean;
  emergencyPhone?: string;
  afterHoursInstructions?: string;
}

export interface FacilityCapabilities {
  sedationAvailable: boolean;
  speciesAccepted: Species[];
  onSiteVisits: boolean;
  emergencyServices: boolean;
}

export interface Facility {
  facilityId: string;
  name: string;
  credentials: string[];
  licenseNumber: string;
  address: Address;
  contactPhone: string;
  contactEmail: string;
  operatingHours: OperatingHours;
  emergencyHours: EmergencyHours;
  capabilities: FacilityCapabilities;
  bloodTypesNeeded: BloodType[];
  inventoryStatus: 'CRITICAL' | 'LOW' | 'ADEQUATE' | 'GOOD';
  rating?: number;
  reviewCount?: number;
  verificationStatus: VerificationStatus;
  photos: string[];
  accessibilityFeatures: string[];
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}
