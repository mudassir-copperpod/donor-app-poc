export enum ConsentStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  PENDING_RENEWAL = 'PENDING_RENEWAL',
}

export interface ConsentData {
  // Owner Certification
  ownerCertification: boolean;
  authorizedAgent: boolean;
  
  // Authorization for Procedures
  authorizesBloodCollection: boolean;
  authorizesSedation: boolean;
  authorizesPreExam: boolean;
  authorizesBloodScreening: boolean;
  
  // Risk Acknowledgment
  understandsRisks: boolean;
  risksExplained: boolean;
  
  // Program Commitment
  commitsToProgram: boolean;
  understandsFrequencyLimits: boolean;
  agreesToNotifyHealthChanges: boolean;
  acknowledgesCancellationPolicy: boolean;
  
  // Publicity Release (Optional)
  allowsPublicity: boolean;
  
  // Additional Notes
  additionalNotes?: string;
}

export interface ConsentRecord {
  consentId: string;
  petId: string;
  ownerId: string;
  consentData: ConsentData;
  signatureDataUrl: string; // Base64 encoded signature image
  signedAt: string; // ISO date
  ipAddress: string;
  consentFormVersion: string;
  status: ConsentStatus;
  expiresAt: string; // ISO date (typically 1 year from signing)
  renewalNotificationSent: boolean;
  pdfUrl?: string; // Generated PDF of signed consent
  createdAt: string;
  updatedAt: string;
}
