export enum Species {
  DOG = 'DOG',
  CAT = 'CAT',
  HORSE = 'HORSE',
  RABBIT = 'RABBIT',
  FERRET = 'FERRET',
  GOAT = 'GOAT',
  SHEEP = 'SHEEP',
  PIG = 'PIG',
  COW = 'COW',
  LLAMA = 'LLAMA',
  ALPACA = 'ALPACA',
}

export enum Sex {
  MALE = 'MALE',
  NEUTERED_MALE = 'NEUTERED_MALE',
  FEMALE = 'FEMALE',
  SPAYED_FEMALE = 'SPAYED_FEMALE',
}

export enum EligibilityStatus {
  ELIGIBLE = 'ELIGIBLE',
  PENDING_REVIEW = 'PENDING_REVIEW',
  TEMPORARILY_INELIGIBLE = 'TEMPORARILY_INELIGIBLE',
  INELIGIBLE = 'INELIGIBLE',
  RE_VERIFICATION_REQUIRED = 'RE_VERIFICATION_REQUIRED',
}

export enum BloodType {
  // Dogs
  DOG_DEA_1_1_POSITIVE = 'DOG_DEA_1_1_POSITIVE',
  DOG_DEA_1_1_NEGATIVE = 'DOG_DEA_1_1_NEGATIVE',
  DOG_UNIVERSAL_DONOR = 'DOG_UNIVERSAL_DONOR',
  
  // Cats
  CAT_TYPE_A = 'CAT_TYPE_A',
  CAT_TYPE_B = 'CAT_TYPE_B',
  CAT_TYPE_AB = 'CAT_TYPE_AB',
  
  // Horses
  HORSE_AA_POSITIVE = 'HORSE_AA_POSITIVE',
  HORSE_QA_POSITIVE = 'HORSE_QA_POSITIVE',
  
  // Rabbits
  RABBIT_UNIVERSAL = 'RABBIT_UNIVERSAL',
  
  // Ferrets
  FERRET_UNIVERSAL = 'FERRET_UNIVERSAL',
  
  // Goats
  GOAT_TYPE_A = 'GOAT_TYPE_A',
  GOAT_TYPE_B = 'GOAT_TYPE_B',
  
  // Sheep
  SHEEP_TYPE_A = 'SHEEP_TYPE_A',
  SHEEP_TYPE_B = 'SHEEP_TYPE_B',
  
  // Pigs
  PIG_UNIVERSAL = 'PIG_UNIVERSAL',
  
  // Cows
  COW_TYPE_A = 'COW_TYPE_A',
  COW_TYPE_B = 'COW_TYPE_B',
  COW_TYPE_AB = 'COW_TYPE_AB',
  
  // Llamas & Alpacas
  CAMELID_UNIVERSAL = 'CAMELID_UNIVERSAL',
  
  UNKNOWN = 'UNKNOWN',
}

export interface WeightRecord {
  weight: number; // in lbs
  unit: 'lbs' | 'kg';
  date: string; // ISO date
}

export interface VeterinarianInfo {
  veterinarianName: string;
  clinicName: string;
  clinicPhone: string;
  clinicEmail: string;
  licenseNumber?: string;
  permissionToContact: boolean;
}

export interface MedicalDocument {
  documentId: string;
  type: 'VACCINATION' | 'TEST_RESULT' | 'HEALTH_RECORD' | 'OTHER';
  name: string;
  url: string;
  uploadDate: string;
}

export interface Pet {
  petId: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  dateOfBirth: string; // ISO date
  age: number; // calculated
  sex: Sex;
  weightHistory: WeightRecord[];
  currentWeight: number; // in lbs
  color: string;
  markings?: string;
  microchipNumber?: string;
  photoUrl: string;
  veterinarianInfo: VeterinarianInfo;
  bloodType: BloodType;
  eligibilityStatus: EligibilityStatus;
  eligibilityNotes?: string;
  nextReviewDate?: string; // ISO date
  createdAt: string;
  updatedAt: string;
}
