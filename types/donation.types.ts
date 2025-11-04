export enum DonationStatus {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum UsageStatus {
  USED = 'USED',
  STORED = 'STORED',
  EXPIRED = 'EXPIRED',
}

export interface PreExamResults {
  weight: number;
  temperature: number;
  heartRate: number;
  overallHealth: string;
  notes?: string;
}

export interface CollectionDetails {
  volumeCollected: number; // in ml
  collectionMethod: string;
  duration: number; // in minutes
  sedationUsed: boolean;
  sedationType?: string;
}

export interface LabScreeningResults {
  completedBloodCount: Record<string, any>;
  bloodChemistryPanel: Record<string, any>;
  infectiousDiseaseScreening: Record<string, any>;
}

export interface DonationRecord {
  donationId: string;
  appointmentId: string;
  petId: string;
  facilityId: string;
  donationDate: string; // ISO date
  preExamResults: PreExamResults;
  collectionDetails: CollectionDetails;
  bloodTypingResults?: string;
  labScreeningResults?: LabScreeningResults;
  postObservationNotes?: string;
  adverseReactions?: string;
  donationStatus: DonationStatus;
  usageStatus: UsageStatus;
  attendingVeterinarian: string;
  nextEligibleDate: string; // ISO date (8-12 weeks later)
  createdAt: string;
  updatedAt: string;
}
