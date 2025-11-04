import { Species } from '../types';

export const SpeciesConfig = {
  [Species.DOG]: {
    name: "Dog",
    icon: "🐕",
    color: "#FF6B6B",
    minAge: 1,
    maxAge: 8,
    minWeight: 55, // lbs
    donationInterval: 8, // weeks
    typicalVolume: 450, // ml
    eligibilityCriteria: {
      ageRange: "1-8 years",
      minWeight: "55 lbs (25 kg)",
      spayedNeutered: "Recommended",
      vaccinations: "Current on all core vaccines",
      heartwormTest: "Negative within 12 months",
      tickBorneDisease: "Negative screening required",
    },
  },
  [Species.CAT]: {
    name: "Cat",
    icon: "🐈",
    color: "#4ECDC4",
    minAge: 1,
    maxAge: 8,
    minWeight: 10, // lbs
    donationInterval: 8, // weeks
    typicalVolume: 50, // ml
    eligibilityCriteria: {
      ageRange: "1-8 years",
      minWeight: "10 lbs (4.5 kg)",
      spayedNeutered: "Required",
      vaccinations: "Current on all core vaccines",
      felvFivTest: "Negative required",
      indoorOnly: "Required",
    },
  },
  [Species.HORSE]: {
    name: "Horse",
    icon: "🐴",
    color: "#95E1D3",
    minAge: 2,
    maxAge: 20,
    minWeight: 800, // lbs
    donationInterval: 8, // weeks
    typicalVolume: 6000, // ml (6 liters)
    eligibilityCriteria: {
      ageRange: "2-20 years",
      minWeight: "800 lbs (363 kg)",
      cogginsTest: "Negative within 12 months",
      eiaTest: "Negative required",
      transportAvailable: "Required for off-site donations",
    },
  },
};

export const getSpeciesConfig = (species: Species) => {
  return SpeciesConfig[species];
};

export const getSpeciesIcon = (species: Species): string => {
  return SpeciesConfig[species].icon;
};

export const getSpeciesColor = (species: Species): string => {
  return SpeciesConfig[species].color;
};
