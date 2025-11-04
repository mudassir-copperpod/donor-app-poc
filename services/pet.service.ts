import { Pet, Species, EligibilityStatus } from '../types';
import { mockPets, getPetById, getPetsByOwnerId, getEligiblePets } from '../data';

export interface CreatePetData {
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  dateOfBirth: string;
  sex: string;
  currentWeight: number;
  color: string;
  markings?: string;
  microchipNumber?: string;
  photoUrl: string;
  veterinarianInfo: {
    veterinarianName: string;
    clinicName: string;
    clinicPhone: string;
    clinicEmail: string;
    permissionToContact: boolean;
  };
}

export interface UpdatePetData extends Partial<CreatePetData> {
  petId: string;
}

/**
 * Pet Service - Handles all pet-related operations
 */
class PetService {
  private pets: Pet[] = [...mockPets];

  /**
   * Get all pets for a specific owner
   */
  async getPetsByOwner(ownerId: string): Promise<Pet[]> {
    await this.delay(300);
    return this.pets.filter(pet => pet.ownerId === ownerId);
  }

  /**
   * Get a single pet by ID
   */
  async getPetById(petId: string): Promise<Pet | null> {
    await this.delay(200);
    const pet = this.pets.find(p => p.petId === petId);
    return pet || null;
  }

  /**
   * Create a new pet
   */
  async createPet(data: CreatePetData): Promise<Pet> {
    await this.delay(500);

    const age = this.calculateAge(data.dateOfBirth);
    
    // Auto-determine eligibility based on weight and age
    const eligibilityStatus = this.determineEligibility(data.species, data.currentWeight, age);
    
    const newPet: Pet = {
      petId: `pet-${Date.now()}`,
      ownerId: data.ownerId,
      name: data.name,
      species: data.species,
      breed: data.breed,
      dateOfBirth: data.dateOfBirth,
      age,
      sex: data.sex as any,
      weightHistory: [
        {
          weight: data.currentWeight,
          unit: 'lbs',
          date: new Date().toISOString(),
        },
      ],
      currentWeight: data.currentWeight,
      color: data.color,
      markings: data.markings,
      microchipNumber: data.microchipNumber,
      photoUrl: data.photoUrl,
      veterinarianInfo: data.veterinarianInfo,
      bloodType: 'UNKNOWN' as any,
      eligibilityStatus,
      eligibilityNotes: this.getEligibilityNotes(data.species, data.currentWeight, age, eligibilityStatus),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.pets.push(newPet);
    return newPet;
  }

  /**
   * Update an existing pet
   */
  async updatePet(data: UpdatePetData): Promise<Pet | null> {
    await this.delay(400);

    const index = this.pets.findIndex(p => p.petId === data.petId);
    if (index === -1) {
      return null;
    }

    const existingPet = this.pets[index];
    
    // Update weight history if weight changed
    const weightHistory = [...existingPet.weightHistory];
    if (data.currentWeight && data.currentWeight !== existingPet.currentWeight) {
      weightHistory.push({
        weight: data.currentWeight,
        unit: 'lbs',
        date: new Date().toISOString(),
      });
    }

    const updatedPet: Pet = {
      ...existingPet,
      ...data,
      weightHistory,
      age: data.dateOfBirth ? this.calculateAge(data.dateOfBirth) : existingPet.age,
      updatedAt: new Date().toISOString(),
    };

    this.pets[index] = updatedPet;
    return updatedPet;
  }

  /**
   * Delete a pet
   */
  async deletePet(petId: string): Promise<boolean> {
    await this.delay(300);

    const index = this.pets.findIndex(p => p.petId === petId);
    if (index === -1) {
      return false;
    }

    this.pets.splice(index, 1);
    return true;
  }

  /**
   * Get eligible pets for donation
   */
  async getEligiblePets(ownerId?: string): Promise<Pet[]> {
    await this.delay(300);

    let eligible = this.pets.filter(
      pet => pet.eligibilityStatus === EligibilityStatus.ELIGIBLE
    );

    if (ownerId) {
      eligible = eligible.filter(pet => pet.ownerId === ownerId);
    }

    return eligible;
  }

  /**
   * Update pet eligibility status
   */
  async updateEligibilityStatus(
    petId: string,
    status: EligibilityStatus,
    notes?: string,
    nextReviewDate?: string
  ): Promise<Pet | null> {
    await this.delay(300);

    const index = this.pets.findIndex(p => p.petId === petId);
    if (index === -1) {
      return null;
    }

    const updatedPet: Pet = {
      ...this.pets[index],
      eligibilityStatus: status,
      eligibilityNotes: notes,
      nextReviewDate,
      updatedAt: new Date().toISOString(),
    };

    this.pets[index] = updatedPet;
    return updatedPet;
  }

  /**
   * Update pet blood type
   */
  async updateBloodType(petId: string, bloodType: string): Promise<Pet | null> {
    await this.delay(200);

    const index = this.pets.findIndex(p => p.petId === petId);
    if (index === -1) {
      return null;
    }

    const updatedPet: Pet = {
      ...this.pets[index],
      bloodType: bloodType as any,
      updatedAt: new Date().toISOString(),
    };

    this.pets[index] = updatedPet;
    return updatedPet;
  }

  /**
   * Get pets by species
   */
  async getPetsBySpecies(species: Species, ownerId?: string): Promise<Pet[]> {
    await this.delay(250);

    let filtered = this.pets.filter(pet => pet.species === species);

    if (ownerId) {
      filtered = filtered.filter(pet => pet.ownerId === ownerId);
    }

    return filtered;
  }

  /**
   * Search pets by name
   */
  async searchPets(query: string, ownerId?: string): Promise<Pet[]> {
    await this.delay(300);

    const lowerQuery = query.toLowerCase();
    let results = this.pets.filter(pet =>
      pet.name.toLowerCase().includes(lowerQuery) ||
      pet.breed.toLowerCase().includes(lowerQuery)
    );

    if (ownerId) {
      results = results.filter(pet => pet.ownerId === ownerId);
    }

    return results;
  }

  // Helper methods

  private calculateAge(dateOfBirth: string): number {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Determine eligibility status based on species, weight, and age
   * Based on veterinary industry standards for blood donation
   */
  private determineEligibility(species: Species, weight: number, age: number): EligibilityStatus {
    // Weight and age requirements by species
    switch (species) {
      case Species.DOG:
        if (age < 1 || age > 8) return EligibilityStatus.INELIGIBLE;
        if (weight >= 55) return EligibilityStatus.ELIGIBLE;
        if (weight >= 45) return EligibilityStatus.TEMPORARILY_INELIGIBLE;
        return EligibilityStatus.INELIGIBLE;
      
      case Species.CAT:
        if (age < 1 || age > 8) return EligibilityStatus.INELIGIBLE;
        if (weight >= 10) return EligibilityStatus.ELIGIBLE;
        if (weight >= 8) return EligibilityStatus.TEMPORARILY_INELIGIBLE;
        return EligibilityStatus.INELIGIBLE;
      
      case Species.HORSE:
        if (age < 2 || age > 20) return EligibilityStatus.INELIGIBLE;
        if (weight >= 900) return EligibilityStatus.ELIGIBLE;
        return EligibilityStatus.INELIGIBLE;
      
      case Species.RABBIT:
        if (age < 1 || age > 6) return EligibilityStatus.INELIGIBLE;
        if (weight >= 9) return EligibilityStatus.ELIGIBLE;
        return EligibilityStatus.TEMPORARILY_INELIGIBLE;
      
      case Species.FERRET:
        if (age < 1 || age > 5) return EligibilityStatus.INELIGIBLE;
        if (weight >= 2) return EligibilityStatus.ELIGIBLE;
        return EligibilityStatus.TEMPORARILY_INELIGIBLE;
      
      case Species.GOAT:
        if (age < 1 || age > 8) return EligibilityStatus.INELIGIBLE;
        if (weight >= 60) return EligibilityStatus.ELIGIBLE;
        return EligibilityStatus.TEMPORARILY_INELIGIBLE;
      
      case Species.SHEEP:
        if (age < 1 || age > 7) return EligibilityStatus.INELIGIBLE;
        if (weight >= 80) return EligibilityStatus.ELIGIBLE;
        return EligibilityStatus.TEMPORARILY_INELIGIBLE;
      
      case Species.PIG:
        if (age < 1 || age > 5) return EligibilityStatus.INELIGIBLE;
        if (weight >= 150) return EligibilityStatus.ELIGIBLE;
        return EligibilityStatus.TEMPORARILY_INELIGIBLE;
      
      case Species.COW:
        if (age < 2 || age > 10) return EligibilityStatus.INELIGIBLE;
        if (weight >= 800) return EligibilityStatus.ELIGIBLE;
        return EligibilityStatus.TEMPORARILY_INELIGIBLE;
      
      case Species.LLAMA:
      case Species.ALPACA:
        if (age < 2 || age > 15) return EligibilityStatus.INELIGIBLE;
        if (weight >= 250) return EligibilityStatus.ELIGIBLE;
        return EligibilityStatus.TEMPORARILY_INELIGIBLE;
      
      default:
        return EligibilityStatus.PENDING_REVIEW;
    }
  }

  /**
   * Get eligibility notes based on status
   */
  private getEligibilityNotes(species: Species, weight: number, age: number, status: EligibilityStatus): string | undefined {
    if (status === EligibilityStatus.ELIGIBLE) {
      return 'Meets all eligibility requirements for blood donation';
    }

    const reasons: string[] = [];
    let ageRange = '';
    let minWeight = 0;

    // Get species-specific requirements
    switch (species) {
      case Species.DOG:
        ageRange = '1-8 years';
        minWeight = 55;
        break;
      case Species.CAT:
        ageRange = '1-8 years';
        minWeight = 10;
        break;
      case Species.HORSE:
        ageRange = '2-20 years';
        minWeight = 900;
        break;
      case Species.RABBIT:
        ageRange = '1-6 years';
        minWeight = 9;
        break;
      case Species.FERRET:
        ageRange = '1-5 years';
        minWeight = 2;
        break;
      case Species.GOAT:
        ageRange = '1-8 years';
        minWeight = 60;
        break;
      case Species.SHEEP:
        ageRange = '1-7 years';
        minWeight = 80;
        break;
      case Species.PIG:
        ageRange = '1-5 years';
        minWeight = 150;
        break;
      case Species.COW:
        ageRange = '2-10 years';
        minWeight = 800;
        break;
      case Species.LLAMA:
      case Species.ALPACA:
        ageRange = '2-15 years';
        minWeight = 250;
        break;
    }

    // Check age eligibility
    const [minAge, maxAge] = ageRange.split('-').map(s => parseInt(s));
    if (age < minAge || age > maxAge) {
      reasons.push(`Age must be between ${ageRange}`);
    }

    // Check weight eligibility
    if (weight < minWeight) {
      reasons.push(`Weight below minimum requirement (${minWeight} lbs)`);
    }

    return reasons.length > 0 ? reasons.join('. ') : undefined;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const petService = new PetService();
