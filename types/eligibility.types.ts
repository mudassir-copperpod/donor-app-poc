import { Species } from './pet.types';

export enum DisqualifyingFactorType {
  AGE = 'AGE',
  WEIGHT = 'WEIGHT',
  HEALTH = 'HEALTH',
  MEDICATION = 'MEDICATION',
  TRANSFUSION_HISTORY = 'TRANSFUSION_HISTORY',
  DISEASE = 'DISEASE',
  PREGNANCY = 'PREGNANCY',
  TEMPERAMENT = 'TEMPERAMENT',
  LIFESTYLE = 'LIFESTYLE',
  VACCINATION = 'VACCINATION',
  OTHER = 'OTHER',
}

export interface DisqualifyingFactor {
  type: DisqualifyingFactorType;
  description: string;
  severity: 'PERMANENT' | 'TEMPORARY';
  reviewDate?: string; // ISO date for temporary factors
}

export interface BaseQuestionnaireResponse {
  // Common questions for all species
  goodPhysicalHealth: boolean;
  noChronicConditions: boolean;
  noRecentIllness: boolean;
  friendlyTemperament: boolean;
  comfortableWithRestraint: boolean;
  currentOnVaccinations: boolean;
  vaccinationCertificateUrl?: string;
  onlyRoutineMedications: boolean;
  medicationsList: string[];
  neverReceivedTransfusion: boolean;
  recentTravelHistory: string;
}

export interface DogQuestionnaireResponse extends BaseQuestionnaireResponse {
  species: Species.DOG;
  spayedNeutered: boolean;
  notPregnantOrNursing: boolean;
  heartwormTestNegative: boolean;
  heartwormTestDate: string;
  tickBorneDiseaseNegative: boolean;
  dietType: 'COMMERCIAL' | 'RAW' | 'HOME_COOKED' | 'MIXED';
  activityLevel: 'LOW' | 'MODERATE' | 'HIGH';
  exerciseRoutine: string;
  behavioralNotes: string;
}

export interface CatQuestionnaireResponse extends BaseQuestionnaireResponse {
  species: Species.CAT;
  spayedNeutered: boolean;
  indoorOnly: boolean;
  neverPregnant: boolean;
  felvFivTestNegative: boolean;
  felvFivTestDate: string;
  sedationTolerance: 'UNKNOWN' | 'GOOD' | 'POOR';
  handlingSensitivity: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface HorseQuestionnaireResponse extends BaseQuestionnaireResponse {
  species: Species.HORSE;
  reproductiveStatus: 'STALLION' | 'GELDING' | 'MARE' | 'SPAYED_MARE';
  pregnancyHistory: string;
  cogginsTestNegative: boolean;
  cogginsTestDate: string;
  eiaTestNegative: boolean;
  performanceMedications: string[];
  stableLocation: string;
  transportAvailable: boolean;
  previousSedationHistory: string;
}

export type QuestionnaireResponse = 
  | DogQuestionnaireResponse 
  | CatQuestionnaireResponse 
  | HorseQuestionnaireResponse;

export interface EligibilityRecord {
  eligibilityId: string;
  petId: string;
  submittedAt: string; // ISO date
  questionnaireResponse: QuestionnaireResponse;
  disqualifyingFactors: DisqualifyingFactor[];
  overallStatus: 'ELIGIBLE' | 'PENDING_REVIEW' | 'TEMPORARILY_INELIGIBLE' | 'INELIGIBLE';
  reviewNotes?: string;
  nextReviewDate?: string; // ISO date
  reviewedBy?: string; // Veterinarian ID
  reviewedAt?: string; // ISO date
  createdAt: string;
  updatedAt: string;
}
