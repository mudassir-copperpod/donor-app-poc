import { Species } from '../types';
import { SpeciesConfig } from '../constants/Species';

/**
 * Get eligibility criteria for a species
 */
export const getEligibilityCriteria = (species: Species) => {
  return SpeciesConfig[species].eligibilityCriteria;
};

/**
 * Get age range text for a species
 */
export const getAgeRangeText = (species: Species): string => {
  const config = SpeciesConfig[species];
  return `${config.minAge}-${config.maxAge} years`;
};

/**
 * Get minimum weight text for a species
 */
export const getMinWeightText = (species: Species): string => {
  const config = SpeciesConfig[species];
  return `${config.minWeight} lbs`;
};

/**
 * Check if pet meets age requirements
 */
export const meetsAgeRequirement = (age: number, species: Species): boolean => {
  const config = SpeciesConfig[species];
  return age >= config.minAge && age <= config.maxAge;
};

/**
 * Check if pet meets weight requirements
 */
export const meetsWeightRequirement = (weight: number, species: Species): boolean => {
  const config = SpeciesConfig[species];
  return weight >= config.minWeight;
};

/**
 * Get donation interval in weeks
 */
export const getDonationInterval = (species: Species): number => {
  return SpeciesConfig[species].donationInterval;
};

/**
 * Calculate next eligible donation date
 */
export const calculateNextDonationDate = (lastDonationDate: Date, species: Species): Date => {
  const interval = getDonationInterval(species);
  const nextDate = new Date(lastDonationDate);
  nextDate.setDate(nextDate.getDate() + (interval * 7));
  return nextDate;
};

/**
 * Format eligibility status for display
 */
export const formatEligibilityStatus = (status: string): string => {
  switch (status) {
    case 'ELIGIBLE':
      return 'Eligible';
    case 'PENDING_REVIEW':
      return 'Pending Review';
    case 'TEMPORARILY_INELIGIBLE':
      return 'Temporarily Ineligible';
    case 'INELIGIBLE':
      return 'Ineligible';
    case 'NOT_ASSESSED':
      return 'Not Assessed';
    default:
      return status;
  }
};

/**
 * Get status color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'ELIGIBLE':
      return '#10B981'; // green
    case 'PENDING_REVIEW':
      return '#F59E0B'; // amber
    case 'TEMPORARILY_INELIGIBLE':
      return '#EF4444'; // red
    case 'INELIGIBLE':
      return '#6B7280'; // gray
    case 'NOT_ASSESSED':
      return '#3B82F6'; // blue
    default:
      return '#6B7280';
  }
};

/**
 * Get guidance message based on eligibility status
 */
export const getGuidanceMessage = (status: string, hasTemporaryFactors: boolean): string => {
  switch (status) {
    case 'ELIGIBLE':
      return 'Great news! Your pet is eligible to donate blood. You can now proceed to sign the consent form and book an appointment.';
    case 'PENDING_REVIEW':
      return 'Your pet\'s eligibility requires veterinary review. Our team will contact you within 2-3 business days to discuss next steps.';
    case 'TEMPORARILY_INELIGIBLE':
      return hasTemporaryFactors
        ? 'Your pet is temporarily ineligible. Please address the issues listed below and retake the questionnaire when ready.'
        : 'Your pet is temporarily ineligible. Please check back after the review date.';
    case 'INELIGIBLE':
      return 'Unfortunately, your pet does not meet the eligibility criteria for blood donation at this time. Thank you for your interest in the program.';
    default:
      return 'Please complete the eligibility questionnaire to determine if your pet can donate blood.';
  }
};
