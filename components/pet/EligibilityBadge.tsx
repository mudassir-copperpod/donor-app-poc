import React from 'react';
import { EligibilityStatus } from '@/types/pet.types';
import { Badge } from '@/components/ui/Badge';

interface EligibilityBadgeProps {
  status: EligibilityStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const getVariant = () => {
    switch (status) {
      case 'ELIGIBLE':
        return 'eligible';
      case 'PENDING_REVIEW':
        return 'pending';
      case 'TEMPORARILY_INELIGIBLE':
        return 'temporaryIneligible';
      case 'INELIGIBLE':
        return 'ineligible';
      case 'RE_VERIFICATION_REQUIRED':
        return 'reVerificationRequired';
      default:
        return 'pending';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'ELIGIBLE':
        return 'Eligible';
      case 'PENDING_REVIEW':
        return 'Pending Review';
      case 'TEMPORARILY_INELIGIBLE':
        return 'Temporarily Ineligible';
      case 'INELIGIBLE':
        return 'Ineligible';
      case 'RE_VERIFICATION_REQUIRED':
        return 'Re-verification Required';
      default:
        return 'Unknown';
    }
  };

  return <Badge label={getLabel()} variant={getVariant()} size={size} />;
};
