import { useState, useEffect, useCallback } from 'react';
import { DonationService } from '../services/donation.service';
import { DonationRecord, DonationStatus } from '../types/donation.types';
import { useAuth } from './useAuth';

interface DonationsState {
  donations: DonationRecord[];
  stats: any;
  isLoading: boolean;
  error: string | null;
}

export const useDonations = (userIdProp?: string) => {
  const { user } = useAuth();
  const userId = userIdProp || user?.userId;
  
  const [state, setState] = useState<DonationsState>({
    donations: [],
    stats: null,
    isLoading: false,
    error: null,
  });

  /**
   * Load donations for user
   */
  const loadDonations = useCallback(async (ownerId?: string) => {
    if (!ownerId && !userId) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const donations = await DonationService.getDonationsByUserId(ownerId || userId!);
      const stats = await DonationService.getDonationStats(ownerId || userId!);
      
      setState(prev => ({
        ...prev,
        donations,
        stats,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load donations';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [userId]);

  /**
   * Load donations on mount
   */
  useEffect(() => {
    if (userId) {
      loadDonations(userId);
    }
  }, [userId, loadDonations]);

  /**
   * Get donation by ID
   */
  const getDonationById = useCallback(async (donationId: string) => {
    try {
      const donation = await DonationService.getDonationById(donationId);
      return { success: true, donation };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get donation';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Get donations for a specific pet
   */
  const getDonationsByPet = useCallback(async (petId: string) => {
    try {
      const donations = await DonationService.getDonationsByPetId(petId);
      return { success: true, donations };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get pet donations';
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Get recent donations
   */
  const getRecentDonations = useCallback((limit: number = 5) => {
    return state.donations.slice(0, limit);
  }, [state.donations]);

  /**
   * Get donations by status
   */
  const getDonationsByStatus = useCallback((status: DonationStatus) => {
    return state.donations.filter(d => d.donationStatus === status);
  }, [state.donations]);

  /**
   * Check if pet can donate
   */
  const checkPetEligibility = useCallback(async (petId: string) => {
    try {
      const result = await DonationService.isPetEligibleToDonate(petId);
      return result;
    } catch (error) {
      return { eligible: false, reason: 'Error checking eligibility' };
    }
  }, []);

  /**
   * Get donation milestones
   */
  const getMilestones = useCallback(async () => {
    if (!userId) return null;
    
    try {
      const milestones = await DonationService.getDonationMilestones(userId);
      return milestones;
    } catch (error) {
      console.error('Failed to get milestones:', error);
      return null;
    }
  }, [userId]);

  /**
   * Export donation history
   */
  const exportHistory = useCallback(async () => {
    if (!userId) return null;
    
    try {
      const csv = await DonationService.exportDonationHistory(userId);
      return csv;
    } catch (error) {
      console.error('Failed to export history:', error);
      return null;
    }
  }, [userId]);

  /**
   * Refresh donations
   */
  const refresh = useCallback(() => {
    if (userId) {
      loadDonations(userId);
    }
  }, [userId, loadDonations]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    donations: state.donations,
    stats: state.stats,
    isLoading: state.isLoading,
    error: state.error,
    
    // Methods
    loadDonations,
    getDonationById,
    getDonationsByPet,
    getRecentDonations,
    getDonationsByStatus,
    checkPetEligibility,
    getMilestones,
    exportHistory,
    refresh,
    clearError,
  };
};
