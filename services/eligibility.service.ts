import { 
  EligibilityRecord, 
  QuestionnaireResponse, 
  DisqualifyingFactor,
  DisqualifyingFactorType,
  DogQuestionnaireResponse,
  CatQuestionnaireResponse,
  HorseQuestionnaireResponse
} from '../types/eligibility.types';
import { Pet, Species, EligibilityStatus } from '../types/pet.types';
import { storageService } from './storage.service';

const STORAGE_KEY = 'eligibility_records';

class EligibilityServiceClass {
  /**
   * Submit eligibility questionnaire and calculate status
   */
  async submitQuestionnaire(
    petId: string,
    questionnaireResponse: QuestionnaireResponse
  ): Promise<EligibilityRecord> {
    try {
      // Get pet details to validate
      const petsJson = await storageService.getItem('pets');
      const pets: Pet[] = petsJson ? JSON.parse(petsJson) : [];
      const pet = pets.find(p => p.petId === petId);

      if (!pet) {
        throw new Error('Pet not found');
      }

      // Calculate disqualifying factors
      const disqualifyingFactors = this.calculateDisqualifyingFactors(
        pet,
        questionnaireResponse
      );

      // Determine overall status
      const overallStatus = this.determineEligibilityStatus(disqualifyingFactors);

      // Calculate next review date
      const nextReviewDate = this.calculateNextReviewDate(
        overallStatus,
        disqualifyingFactors
      );

      // Create eligibility record
      const eligibilityRecord: EligibilityRecord = {
        eligibilityId: `ELG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        petId,
        submittedAt: new Date().toISOString(),
        questionnaireResponse,
        disqualifyingFactors,
        overallStatus,
        nextReviewDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save eligibility record
      await this.saveEligibilityRecord(eligibilityRecord);

      // Update pet's eligibility status
      await this.updatePetEligibilityStatus(petId, overallStatus, nextReviewDate);

      return eligibilityRecord;
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      throw error;
    }
  }

  /**
   * Calculate disqualifying factors based on questionnaire responses
   */
  private calculateDisqualifyingFactors(
    pet: Pet,
    response: QuestionnaireResponse
  ): DisqualifyingFactor[] {
    const factors: DisqualifyingFactor[] = [];

    // Common checks for all species
    if (!response.goodPhysicalHealth) {
      factors.push({
        type: DisqualifyingFactorType.HEALTH,
        description: 'Pet is not in good physical health',
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 3).toISOString(),
      });
    }

    if (!response.noChronicConditions) {
      factors.push({
        type: DisqualifyingFactorType.HEALTH,
        description: 'Pet has chronic medical conditions',
        severity: 'PERMANENT',
      });
    }

    if (!response.noRecentIllness) {
      factors.push({
        type: DisqualifyingFactorType.HEALTH,
        description: 'Pet has been ill within the past 30 days',
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 1).toISOString(),
      });
    }

    if (!response.friendlyTemperament || !response.comfortableWithRestraint) {
      factors.push({
        type: DisqualifyingFactorType.TEMPERAMENT,
        description: 'Pet may not be comfortable with donation procedures',
        severity: 'PERMANENT',
      });
    }

    if (!response.currentOnVaccinations) {
      factors.push({
        type: DisqualifyingFactorType.VACCINATION,
        description: 'Pet is not current on vaccinations',
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 1).toISOString(),
      });
    }

    if (!response.onlyRoutineMedications) {
      factors.push({
        type: DisqualifyingFactorType.MEDICATION,
        description: 'Pet is on non-routine medications',
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 3).toISOString(),
      });
    }

    if (!response.neverReceivedTransfusion) {
      factors.push({
        type: DisqualifyingFactorType.TRANSFUSION_HISTORY,
        description: 'Pet has previously received a blood transfusion',
        severity: 'PERMANENT',
      });
    }

    // Species-specific checks
    if (response.species === Species.DOG) {
      this.checkDogEligibility(pet, response as DogQuestionnaireResponse, factors);
    } else if (response.species === Species.CAT) {
      this.checkCatEligibility(pet, response as CatQuestionnaireResponse, factors);
    } else if (response.species === Species.HORSE) {
      this.checkHorseEligibility(pet, response as HorseQuestionnaireResponse, factors);
    }

    return factors;
  }

  /**
   * Check dog-specific eligibility criteria
   */
  private checkDogEligibility(
    pet: Pet,
    response: DogQuestionnaireResponse,
    factors: DisqualifyingFactor[]
  ): void {
    // Age check: 1-8 years
    if (pet.age < 1 || pet.age > 8) {
      factors.push({
        type: DisqualifyingFactorType.AGE,
        description: `Dog must be between 1-8 years old (current age: ${pet.age})`,
        severity: pet.age < 1 ? 'TEMPORARY' : 'PERMANENT',
        reviewDate: pet.age < 1 ? this.addMonths(new Date(), 6).toISOString() : undefined,
      });
    }

    // Weight check: Minimum 55 lbs
    if (pet.currentWeight < 55) {
      factors.push({
        type: DisqualifyingFactorType.WEIGHT,
        description: `Dog must weigh at least 55 lbs (current weight: ${pet.currentWeight} lbs)`,
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 3).toISOString(),
      });
    }

    if (!response.notPregnantOrNursing) {
      factors.push({
        type: DisqualifyingFactorType.PREGNANCY,
        description: 'Dog is currently pregnant or nursing',
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 6).toISOString(),
      });
    }

    if (!response.heartwormTestNegative) {
      factors.push({
        type: DisqualifyingFactorType.DISEASE,
        description: 'Dog has tested positive for heartworm',
        severity: 'PERMANENT',
      });
    }

    if (!response.tickBorneDiseaseNegative) {
      factors.push({
        type: DisqualifyingFactorType.DISEASE,
        description: 'Dog has tested positive for tick-borne disease',
        severity: 'PERMANENT',
      });
    }

    if (response.dietType === 'RAW') {
      factors.push({
        type: DisqualifyingFactorType.LIFESTYLE,
        description: 'Raw food diet requires veterinary review',
        severity: 'TEMPORARY',
      });
    }
  }

  /**
   * Check cat-specific eligibility criteria
   */
  private checkCatEligibility(
    pet: Pet,
    response: CatQuestionnaireResponse,
    factors: DisqualifyingFactor[]
  ): void {
    // Age check: 1-8 years
    if (pet.age < 1 || pet.age > 8) {
      factors.push({
        type: DisqualifyingFactorType.AGE,
        description: `Cat must be between 1-8 years old (current age: ${pet.age})`,
        severity: pet.age < 1 ? 'TEMPORARY' : 'PERMANENT',
        reviewDate: pet.age < 1 ? this.addMonths(new Date(), 6).toISOString() : undefined,
      });
    }

    // Weight check: Minimum 10 lbs
    if (pet.currentWeight < 10) {
      factors.push({
        type: DisqualifyingFactorType.WEIGHT,
        description: `Cat must weigh at least 10 lbs (current weight: ${pet.currentWeight} lbs)`,
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 3).toISOString(),
      });
    }

    if (!response.spayedNeutered) {
      factors.push({
        type: DisqualifyingFactorType.OTHER,
        description: 'Cat must be spayed or neutered',
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 2).toISOString(),
      });
    }

    if (!response.indoorOnly) {
      factors.push({
        type: DisqualifyingFactorType.LIFESTYLE,
        description: 'Cat must be indoor-only',
        severity: 'PERMANENT',
      });
    }

    if (!response.felvFivTestNegative) {
      factors.push({
        type: DisqualifyingFactorType.DISEASE,
        description: 'Cat has tested positive for FeLV/FIV',
        severity: 'PERMANENT',
      });
    }

    if (response.handlingSensitivity === 'HIGH') {
      factors.push({
        type: DisqualifyingFactorType.TEMPERAMENT,
        description: 'Cat has high handling sensitivity',
        severity: 'PERMANENT',
      });
    }
  }

  /**
   * Check horse-specific eligibility criteria
   */
  private checkHorseEligibility(
    pet: Pet,
    response: HorseQuestionnaireResponse,
    factors: DisqualifyingFactor[]
  ): void {
    // Age check: 2-20 years
    if (pet.age < 2 || pet.age > 20) {
      factors.push({
        type: DisqualifyingFactorType.AGE,
        description: `Horse must be between 2-20 years old (current age: ${pet.age})`,
        severity: pet.age < 2 ? 'TEMPORARY' : 'PERMANENT',
        reviewDate: pet.age < 2 ? this.addMonths(new Date(), 6).toISOString() : undefined,
      });
    }

    // Weight check: Minimum 800 lbs
    if (pet.currentWeight < 800) {
      factors.push({
        type: DisqualifyingFactorType.WEIGHT,
        description: `Horse must weigh at least 800 lbs (current weight: ${pet.currentWeight} lbs)`,
        severity: 'TEMPORARY',
        reviewDate: this.addMonths(new Date(), 3).toISOString(),
      });
    }

    if (!response.cogginsTestNegative) {
      factors.push({
        type: DisqualifyingFactorType.DISEASE,
        description: 'Horse has tested positive for Coggins/EIA',
        severity: 'PERMANENT',
      });
    }

    if (!response.eiaTestNegative) {
      factors.push({
        type: DisqualifyingFactorType.DISEASE,
        description: 'Horse has tested positive for Equine Infectious Anemia',
        severity: 'PERMANENT',
      });
    }

    if (!response.transportAvailable) {
      factors.push({
        type: DisqualifyingFactorType.OTHER,
        description: 'Transport to facility not available',
        severity: 'TEMPORARY',
      });
    }

    if (response.performanceMedications.length > 0) {
      factors.push({
        type: DisqualifyingFactorType.MEDICATION,
        description: 'Horse is on performance medications requiring review',
        severity: 'TEMPORARY',
      });
    }
  }

  /**
   * Determine overall eligibility status
   */
  private determineEligibilityStatus(
    factors: DisqualifyingFactor[]
  ): 'ELIGIBLE' | 'PENDING_REVIEW' | 'TEMPORARILY_INELIGIBLE' | 'INELIGIBLE' {
    if (factors.length === 0) {
      return 'ELIGIBLE';
    }

    const hasPermanentFactors = factors.some(f => f.severity === 'PERMANENT');
    if (hasPermanentFactors) {
      return 'INELIGIBLE';
    }

    const hasReviewRequired = factors.some(
      f => f.type === DisqualifyingFactorType.LIFESTYLE || 
           f.description.includes('review')
    );
    if (hasReviewRequired) {
      return 'PENDING_REVIEW';
    }

    return 'TEMPORARILY_INELIGIBLE';
  }

  /**
   * Calculate next review date
   */
  private calculateNextReviewDate(
    status: string,
    factors: DisqualifyingFactor[]
  ): string | undefined {
    if (status === 'ELIGIBLE') {
      // Annual re-verification
      return this.addMonths(new Date(), 12).toISOString();
    }

    if (status === 'INELIGIBLE') {
      return undefined;
    }

    // Find earliest review date from temporary factors
    const reviewDates = factors
      .filter(f => f.reviewDate)
      .map(f => new Date(f.reviewDate!));

    if (reviewDates.length > 0) {
      return new Date(Math.min(...reviewDates.map(d => d.getTime()))).toISOString();
    }

    // Default to 3 months
    return this.addMonths(new Date(), 3).toISOString();
  }

  /**
   * Get eligibility record by pet ID
   */
  async getEligibilityByPetId(petId: string): Promise<EligibilityRecord | null> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: EligibilityRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      // Get most recent record for this pet
      const petRecords = records.filter(r => r.petId === petId);
      if (petRecords.length === 0) return null;

      return petRecords.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )[0];
    } catch (error) {
      console.error('Error getting eligibility record:', error);
      return null;
    }
  }

  /**
   * Get all eligibility records for a pet
   */
  async getEligibilityHistory(petId: string): Promise<EligibilityRecord[]> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: EligibilityRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      return records
        .filter(r => r.petId === petId)
        .sort((a, b) => 
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
    } catch (error) {
      console.error('Error getting eligibility history:', error);
      return [];
    }
  }

  /**
   * Save eligibility record
   */
  private async saveEligibilityRecord(record: EligibilityRecord): Promise<void> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: EligibilityRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      records.push(record);
      await storageService.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving eligibility record:', error);
      throw error;
    }
  }

  /**
   * Update pet's eligibility status
   */
  private async updatePetEligibilityStatus(
    petId: string,
    status: string,
    nextReviewDate?: string
  ): Promise<void> {
    try {
      const petsJson = await storageService.getItem('pets');
      const pets: Pet[] = petsJson ? JSON.parse(petsJson) : [];
      
      const petIndex = pets.findIndex(p => p.petId === petId);
      if (petIndex !== -1) {
        pets[petIndex].eligibilityStatus = status as EligibilityStatus;
        pets[petIndex].nextReviewDate = nextReviewDate;
        pets[petIndex].updatedAt = new Date().toISOString();
        
        await storageService.setItem('pets', JSON.stringify(pets));
      }
    } catch (error) {
      console.error('Error updating pet eligibility status:', error);
      throw error;
    }
  }

  /**
   * Helper: Add months to date
   */
  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Check if eligibility needs renewal
   */
  async checkEligibilityRenewal(petId: string): Promise<boolean> {
    try {
      const record = await this.getEligibilityByPetId(petId);
      if (!record || !record.nextReviewDate) return false;

      const reviewDate = new Date(record.nextReviewDate);
      const now = new Date();
      const daysUntilReview = Math.floor(
        (reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Needs renewal if within 30 days of review date
      return daysUntilReview <= 30;
    } catch (error) {
      console.error('Error checking eligibility renewal:', error);
      return false;
    }
  }
}

export const EligibilityService = new EligibilityServiceClass();
