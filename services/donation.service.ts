import { DonationRecord, DonationStatus, UsageStatus } from '../types/donation.types';
import { Pet } from '../types/pet.types';
import { storageService } from './storage.service';
import { mockDonations } from '../data/mockDonations';
import { petService } from './pet.service';

const STORAGE_KEY = 'donation_records';

interface DonationStats {
  totalDonations: number;
  totalVolumeCollected: number; // in ml
  livesImpacted: number; // estimate based on volume
  lastDonationDate?: string;
  nextEligibleDate?: string;
  donationsByYear: Record<string, number>;
  donationsByStatus: Record<DonationStatus, number>;
}

interface PetDonationSummary {
  petId: string;
  petName: string;
  totalDonations: number;
  lastDonationDate?: string;
  nextEligibleDate?: string;
}

class DonationServiceClass {
  /**
   * Get all donation records for a user
   */
  async getDonationsByUserId(userId: string): Promise<DonationRecord[]> {
    try {
      // Get user's pets
      const userPets = await petService.getPetsByOwner(userId);
      const userPetIds = userPets.map(p => p.petId);

      // Use mock donations
      const donations: DonationRecord[] = [...mockDonations];

      // Filter donations for user's pets
      return donations
        .filter(d => userPetIds.includes(d.petId))
        .sort((a, b) => 
          new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
        );
    } catch (error) {
      console.error('Error getting donations by user:', error);
      return [];
    }
  }

  /**
   * Get donation records for a specific pet
   */
  async getDonationsByPetId(petId: string): Promise<DonationRecord[]> {
    try {
      const donations: DonationRecord[] = [...mockDonations];

      return donations
        .filter(d => d.petId === petId)
        .sort((a, b) => 
          new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
        );
    } catch (error) {
      console.error('Error getting donations by pet:', error);
      return [];
    }
  }

  /**
   * Get a specific donation record
   */
  async getDonationById(donationId: string): Promise<DonationRecord | null> {
    try {
      const donations: DonationRecord[] = [...mockDonations];

      return donations.find(d => d.donationId === donationId) || null;
    } catch (error) {
      console.error('Error getting donation by ID:', error);
      return null;
    }
  }

  /**
   * Calculate donation statistics for a user
   */
  async getDonationStats(userId: string): Promise<DonationStats> {
    try {
      const donations = await this.getDonationsByUserId(userId);

      if (donations.length === 0) {
        return {
          totalDonations: 0,
          totalVolumeCollected: 0,
          livesImpacted: 0,
          donationsByYear: {},
          donationsByStatus: {
            [DonationStatus.ACCEPTED]: 0,
            [DonationStatus.DECLINED]: 0,
          },
        };
      }

      // Calculate total volume
      const totalVolumeCollected = donations.reduce(
        (sum, d) => sum + (d.collectionDetails?.volumeCollected || 0),
        0
      );

      // Estimate lives impacted (rough estimate: 1 life per 450ml for dogs/cats)
      const livesImpacted = Math.floor(totalVolumeCollected / 450);

      // Get last donation date
      const lastDonationDate = donations[0].donationDate;

      // Get next eligible date from most recent donation
      const nextEligibleDate = donations[0].nextEligibleDate;

      // Group by year
      const donationsByYear: Record<string, number> = {};
      donations.forEach(d => {
        const year = new Date(d.donationDate).getFullYear().toString();
        donationsByYear[year] = (donationsByYear[year] || 0) + 1;
      });

      // Group by status
      const donationsByStatus = {
        [DonationStatus.ACCEPTED]: donations.filter(
          d => d.donationStatus === DonationStatus.ACCEPTED
        ).length,
        [DonationStatus.DECLINED]: donations.filter(
          d => d.donationStatus === DonationStatus.DECLINED
        ).length,
      };

      return {
        totalDonations: donations.length,
        totalVolumeCollected,
        livesImpacted,
        lastDonationDate,
        nextEligibleDate,
        donationsByYear,
        donationsByStatus,
      };
    } catch (error) {
      console.error('Error calculating donation stats:', error);
      return {
        totalDonations: 0,
        totalVolumeCollected: 0,
        livesImpacted: 0,
        donationsByYear: {},
        donationsByStatus: {
          [DonationStatus.ACCEPTED]: 0,
          [DonationStatus.DECLINED]: 0,
        },
      };
    }
  }

  /**
   * Get donation summary for each pet
   */
  async getPetDonationSummaries(userId: string): Promise<PetDonationSummary[]> {
    try {
      // Get user's pets
      const userPets = await petService.getPetsByOwner(userId);

      const summaries: PetDonationSummary[] = [];

      for (const pet of userPets) {
        const donations = await this.getDonationsByPetId(pet.petId);
        
        summaries.push({
          petId: pet.petId,
          petName: pet.name,
          totalDonations: donations.length,
          lastDonationDate: donations.length > 0 ? donations[0].donationDate : undefined,
          nextEligibleDate: donations.length > 0 ? donations[0].nextEligibleDate : undefined,
        });
      }

      return summaries.sort((a, b) => b.totalDonations - a.totalDonations);
    } catch (error) {
      console.error('Error getting pet donation summaries:', error);
      return [];
    }
  }

  /**
   * Get next eligible donation date for a specific pet
   */
  async getNextDonationDate(petId: string): Promise<string | null> {
    try {
      const donations = await this.getDonationsByPetId(petId);
      
      if (donations.length === 0) {
        // No previous donations, eligible now
        return new Date().toISOString();
      }

      // Get the most recent donation
      const lastDonation = donations[0];
      return lastDonation.nextEligibleDate || null;
    } catch (error) {
      console.error('Error getting next donation date:', error);
      return null;
    }
  }

  /**
   * Get recent donations (last N donations)
   */
  async getRecentDonations(userId: string, limit: number = 5): Promise<DonationRecord[]> {
    try {
      const donations = await this.getDonationsByUserId(userId);
      return donations.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent donations:', error);
      return [];
    }
  }

  /**
   * Check if pet is eligible to donate (based on last donation date)
   */
  async isPetEligibleToDonate(petId: string): Promise<{
    eligible: boolean;
    reason?: string;
    nextEligibleDate?: string;
    daysUntilEligible?: number;
  }> {
    try {
      const donations = await this.getDonationsByPetId(petId);

      if (donations.length === 0) {
        return { eligible: true };
      }

      // Get most recent accepted donation
      const lastAcceptedDonation = donations.find(
        d => d.donationStatus === DonationStatus.ACCEPTED
      );

      if (!lastAcceptedDonation) {
        return { eligible: true };
      }

      const nextEligibleDate = new Date(lastAcceptedDonation.nextEligibleDate);
      const now = new Date();

      if (now >= nextEligibleDate) {
        return { eligible: true };
      }

      const daysUntilEligible = Math.ceil(
        (nextEligibleDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        eligible: false,
        reason: `Pet must wait ${daysUntilEligible} more days before next donation`,
        nextEligibleDate: lastAcceptedDonation.nextEligibleDate,
        daysUntilEligible,
      };
    } catch (error) {
      console.error('Error checking pet eligibility:', error);
      return { eligible: false, reason: 'Error checking eligibility' };
    }
  }

  /**
   * Get donation history with filters
   */
  async getDonationHistory(
    userId: string,
    filters?: {
      petId?: string;
      status?: DonationStatus;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<DonationRecord[]> {
    try {
      let donations = await this.getDonationsByUserId(userId);

      // Apply filters
      if (filters?.petId) {
        donations = donations.filter(d => d.petId === filters.petId);
      }

      if (filters?.status) {
        donations = donations.filter(d => d.donationStatus === filters.status);
      }

      if (filters?.startDate) {
        const startDate = new Date(filters.startDate);
        donations = donations.filter(d => new Date(d.donationDate) >= startDate);
      }

      if (filters?.endDate) {
        const endDate = new Date(filters.endDate);
        donations = donations.filter(d => new Date(d.donationDate) <= endDate);
      }

      return donations;
    } catch (error) {
      console.error('Error getting donation history:', error);
      return [];
    }
  }

  /**
   * Get donation milestones
   */
  async getDonationMilestones(userId: string): Promise<{
    achieved: Array<{ milestone: number; achievedDate: string }>;
    next: { milestone: number; remaining: number };
  }> {
    try {
      const donations = await this.getDonationsByUserId(userId);
      const totalDonations = donations.length;

      const milestones = [1, 5, 10, 25, 50, 100];
      const achieved = milestones
        .filter(m => totalDonations >= m)
        .map(m => {
          // Find the donation that achieved this milestone
          const achievingDonation = donations[donations.length - m];
          return {
            milestone: m,
            achievedDate: achievingDonation?.donationDate || '',
          };
        });

      const nextMilestone = milestones.find(m => m > totalDonations) || milestones[milestones.length - 1] + 50;
      const remaining = nextMilestone - totalDonations;

      return {
        achieved,
        next: { milestone: nextMilestone, remaining },
      };
    } catch (error) {
      console.error('Error getting donation milestones:', error);
      return {
        achieved: [],
        next: { milestone: 1, remaining: 1 },
      };
    }
  }

  /**
   * Export donation history as CSV (mock)
   */
  async exportDonationHistory(userId: string): Promise<string> {
    try {
      const donations = await this.getDonationsByUserId(userId);
      
      // In a real app, this would generate a CSV file
      // For now, return a mock CSV string
      let csv = 'Date,Pet ID,Facility,Volume (ml),Status,Next Eligible Date\n';
      
      donations.forEach(d => {
        csv += `${d.donationDate},${d.petId},${d.facilityId},${d.collectionDetails.volumeCollected},${d.donationStatus},${d.nextEligibleDate}\n`;
      });

      return csv;
    } catch (error) {
      console.error('Error exporting donation history:', error);
      throw error;
    }
  }

  /**
   * Get donation trends (monthly donations over time)
   */
  async getDonationTrends(userId: string, months: number = 12): Promise<{
    labels: string[];
    data: number[];
  }> {
    try {
      const donations = await this.getDonationsByUserId(userId);
      
      const now = new Date();
      const trends: Record<string, number> = {};
      
      // Initialize last N months
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        trends[key] = 0;
      }

      // Count donations per month
      donations.forEach(d => {
        const date = new Date(d.donationDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (trends.hasOwnProperty(key)) {
          trends[key]++;
        }
      });

      const labels = Object.keys(trends);
      const data = Object.values(trends);

      return { labels, data };
    } catch (error) {
      console.error('Error getting donation trends:', error);
      return { labels: [], data: [] };
    }
  }

  /**
   * Get average donation volume by species
   */
  async getAverageDonationVolume(userId: string): Promise<{
    overall: number;
    bySpecies: Record<string, number>;
  }> {
    try {
      const donations = await this.getDonationsByUserId(userId);
      const pets = await petService.getPetsByOwner(userId);

      if (donations.length === 0) {
        return { overall: 0, bySpecies: {} };
      }

      // Calculate overall average
      const totalVolume = donations.reduce(
        (sum, d) => sum + (d.collectionDetails?.volumeCollected || 0),
        0
      );
      const overall = totalVolume / donations.length;

      // Calculate by species
      const bySpecies: Record<string, { total: number; count: number }> = {};
      
      donations.forEach(d => {
        const pet = pets.find(p => p.petId === d.petId);
        if (pet) {
          const species = pet.species;
          if (!bySpecies[species]) {
            bySpecies[species] = { total: 0, count: 0 };
          }
          bySpecies[species].total += d.collectionDetails?.volumeCollected || 0;
          bySpecies[species].count++;
        }
      });

      const averageBySpecies: Record<string, number> = {};
      Object.entries(bySpecies).forEach(([species, data]) => {
        averageBySpecies[species] = data.total / data.count;
      });

      return { overall, bySpecies: averageBySpecies };
    } catch (error) {
      console.error('Error getting average donation volume:', error);
      return { overall: 0, bySpecies: {} };
    }
  }
}

export const DonationService = new DonationServiceClass();
