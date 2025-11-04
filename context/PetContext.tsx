import React, { createContext, useContext, ReactNode } from 'react';
import { usePets } from '../hooks/usePets';
import { Pet, Species, EligibilityStatus } from '../types/pet.types';
import { useAuthContext } from './AuthContext';

interface PetContextType {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  selectedPet: Pet | null;
  loadPets: (ownerId?: string) => Promise<void>;
  getPetById: (petId: string) => Promise<{ success: boolean; pet?: Pet; error?: string }>;
  addPet: (petData: Omit<Pet, 'petId' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; pet?: Pet; error?: string }>;
  updatePet: (petId: string, updates: Partial<Pet>) => Promise<{ success: boolean; pet?: Pet; error?: string }>;
  deletePet: (petId: string) => Promise<{ success: boolean; error?: string }>;
  selectPet: (pet: Pet | null) => void;
  getEligiblePets: () => Pet[];
  getPetsBySpecies: (species: Species) => Pet[];
  searchPets: (query: string) => Pet[];
  getPetStats: () => {
    total: number;
    eligible: number;
    pending: number;
    ineligible: number;
    bySpecies: { dogs: number; cats: number; horses: number };
  };
  refresh: () => void;
  clearError: () => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

interface PetProviderProps {
  children: ReactNode;
}

export const PetProvider: React.FC<PetProviderProps> = ({ children }) => {
  const { user } = useAuthContext();
  const pets = usePets(user?.userId);

  return (
    <PetContext.Provider value={pets}>
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePetContext must be used within a PetProvider');
  }
  return context;
};
