import { useState, useEffect, useCallback } from 'react';
import { petService } from '../services/pet.service';
import { Pet, Species, EligibilityStatus } from '../types/pet.types';
import { useAuth } from './useAuth';

interface PetsState {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  selectedPet: Pet | null;
}

export const usePets = (userIdProp?: string) => {
  const { user } = useAuth();
  const userId = userIdProp || user?.userId;
  
  const [state, setState] = useState<PetsState>({
    pets: [],
    isLoading: false,
    error: null,
    selectedPet: null,
  });

  /**
   * Load pets for user
   */
  const loadPets = useCallback(async (ownerId?: string) => {
    if (!ownerId && !userId) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const pets = await petService.getPetsByOwner(ownerId || userId!);
      
      setState(prev => ({
        ...prev,
        pets,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load pets';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [userId]);

  /**
   * Load pets on mount
   */
  useEffect(() => {
    if (userId) {
      loadPets(userId);
    }
  }, [userId, loadPets]);

  /**
   * Get pet by ID
   */
  const getPetById = useCallback(async (petId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const pet = await petService.getPetById(petId);
      
      if (pet) {
        setState(prev => ({
          ...prev,
          selectedPet: pet,
          isLoading: false,
          error: null,
        }));
        return { success: true, pet };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Pet not found',
        }));
        return { success: false, error: 'Pet not found' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get pet';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Add new pet
   */
  const addPet = useCallback(async (petData: Omit<Pet, 'petId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const newPet = await petService.createPet(petData);
      
      setState(prev => ({
        ...prev,
        pets: [...prev.pets, newPet],
        isLoading: false,
        error: null,
      }));
      
      return { success: true, pet: newPet };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add pet';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Update pet
   */
  const updatePet = useCallback(async (petId: string, updates: Partial<Pet>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const updatedPet = await petService.updatePet(petId, updates);
      if (!updatedPet) throw new Error('Failed to update pet');
      
      setState(prev => ({
        ...prev,
        pets: prev.pets.map(p => p.petId === petId ? updatedPet! : p),
        selectedPet: prev.selectedPet?.petId === petId ? updatedPet : prev.selectedPet,
        isLoading: false,
        error: null,
      }));
      
      return { success: true, pet: updatedPet };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pet';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Delete pet
   */
  const deletePet = useCallback(async (petId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await petService.deletePet(petId);
      
      setState(prev => ({
        ...prev,
        pets: prev.pets.filter(p => p.petId !== petId),
        selectedPet: prev.selectedPet?.petId === petId ? null : prev.selectedPet,
        isLoading: false,
        error: null,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete pet';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Select a pet
   */
  const selectPet = useCallback((pet: Pet | null) => {
    setState(prev => ({ ...prev, selectedPet: pet }));
  }, []);

  /**
   * Get eligible pets (for donation)
   */
  const getEligiblePets = useCallback(() => {
    return state.pets.filter(pet => pet.eligibilityStatus === EligibilityStatus.ELIGIBLE);
  }, [state.pets]);

  /**
   * Get pets by species
   */
  const getPetsBySpecies = useCallback((species: Species) => {
    return state.pets.filter(pet => pet.species === species);
  }, [state.pets]);

  /**
   * Search pets by name
   */
  const searchPets = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return state.pets.filter(pet => 
      pet.name.toLowerCase().includes(lowerQuery) ||
      pet.breed.toLowerCase().includes(lowerQuery)
    );
  }, [state.pets]);

  /**
   * Get pet statistics
   */
  const getPetStats = useCallback(() => {
    return {
      total: state.pets.length,
      eligible: state.pets.filter(p => p.eligibilityStatus === EligibilityStatus.ELIGIBLE).length,
      pending: state.pets.filter(p => p.eligibilityStatus === EligibilityStatus.PENDING_REVIEW).length,
      ineligible: state.pets.filter(p => p.eligibilityStatus === EligibilityStatus.INELIGIBLE).length,
      bySpecies: {
        dogs: state.pets.filter(p => p.species === Species.DOG).length,
        cats: state.pets.filter(p => p.species === Species.CAT).length,
        horses: state.pets.filter(p => p.species === Species.HORSE).length,
      },
    };
  }, [state.pets]);

  /**
   * Refresh pets
   */
  const refresh = useCallback(() => {
    if (userId) {
      loadPets(userId);
    }
  }, [userId, loadPets]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    pets: state.pets,
    isLoading: state.isLoading,
    error: state.error,
    selectedPet: state.selectedPet,
    
    // Methods
    loadPets,
    getPetById,
    addPet,
    updatePet,
    deletePet,
    selectPet,
    
    // Utility methods
    getEligiblePets,
    getPetsBySpecies,
    searchPets,
    getPetStats,
    refresh,
    clearError,
  };
};
