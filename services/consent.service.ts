import { ConsentRecord, ConsentData, ConsentStatus } from '../types/consent.types';
import { Pet } from '../types/pet.types';
import { storageService } from './storage.service';

const STORAGE_KEY = 'consent_records';
const CONSENT_FORM_VERSION = '1.0.0';
const CONSENT_VALIDITY_MONTHS = 12;

class ConsentServiceClass {
  /**
   * Create a new consent record
   */
  async createConsent(
    petId: string,
    ownerId: string,
    consentData: ConsentData,
    signatureDataUrl: string,
    ipAddress: string = '0.0.0.0'
  ): Promise<ConsentRecord> {
    try {
      // Validate consent data
      this.validateConsentData(consentData);

      // Calculate expiration date (1 year from now)
      const expiresAt = this.addMonths(new Date(), CONSENT_VALIDITY_MONTHS);

      // Create consent record
      const consentRecord: ConsentRecord = {
        consentId: `CNS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        petId,
        ownerId,
        consentData,
        signatureDataUrl,
        signedAt: new Date().toISOString(),
        ipAddress,
        consentFormVersion: CONSENT_FORM_VERSION,
        status: ConsentStatus.ACTIVE,
        expiresAt: expiresAt.toISOString(),
        renewalNotificationSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save consent record
      await this.saveConsentRecord(consentRecord);

      // Generate PDF (mock - in real app would generate actual PDF)
      const pdfUrl = await this.generateConsentPDF(consentRecord);
      consentRecord.pdfUrl = pdfUrl;
      await this.updateConsentRecord(consentRecord);

      return consentRecord;
    } catch (error) {
      console.error('Error creating consent:', error);
      throw error;
    }
  }

  /**
   * Validate consent data
   */
  private validateConsentData(data: ConsentData): void {
    const requiredFields = [
      'ownerCertification',
      'authorizesBloodCollection',
      'authorizesSedation',
      'authorizesPreExam',
      'authorizesBloodScreening',
      'understandsRisks',
      'risksExplained',
      'commitsToProgram',
      'understandsFrequencyLimits',
      'agreesToNotifyHealthChanges',
      'acknowledgesCancellationPolicy',
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof ConsentData]) {
        throw new Error(`Required consent field missing: ${field}`);
      }
    }
  }

  /**
   * Get consent record by ID
   */
  async getConsentById(consentId: string): Promise<ConsentRecord | null> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: ConsentRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      return records.find(r => r.consentId === consentId) || null;
    } catch (error) {
      console.error('Error getting consent record:', error);
      return null;
    }
  }

  /**
   * Get active consent for a pet
   */
  async getActiveConsentByPetId(petId: string): Promise<ConsentRecord | null> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: ConsentRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      // Find active consent for this pet
      const activeConsents = records.filter(
        r => r.petId === petId && r.status === ConsentStatus.ACTIVE
      );

      if (activeConsents.length === 0) return null;

      // Return most recent active consent
      return activeConsents.sort((a, b) => 
        new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime()
      )[0];
    } catch (error) {
      console.error('Error getting active consent:', error);
      return null;
    }
  }

  /**
   * Get all consent records for a pet
   */
  async getConsentHistory(petId: string): Promise<ConsentRecord[]> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: ConsentRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      return records
        .filter(r => r.petId === petId)
        .sort((a, b) => 
          new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime()
        );
    } catch (error) {
      console.error('Error getting consent history:', error);
      return [];
    }
  }

  /**
   * Check if pet has valid consent
   */
  async hasValidConsent(petId: string): Promise<boolean> {
    try {
      const activeConsent = await this.getActiveConsentByPetId(petId);
      
      if (!activeConsent) return false;

      // Check if consent is expired
      const now = new Date();
      const expiresAt = new Date(activeConsent.expiresAt);
      
      if (now > expiresAt) {
        // Mark consent as expired
        activeConsent.status = ConsentStatus.EXPIRED;
        await this.updateConsentRecord(activeConsent);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking valid consent:', error);
      return false;
    }
  }

  /**
   * Revoke consent
   */
  async revokeConsent(consentId: string, reason?: string): Promise<void> {
    try {
      const consent = await this.getConsentById(consentId);
      
      if (!consent) {
        throw new Error('Consent record not found');
      }

      consent.status = ConsentStatus.REVOKED;
      consent.updatedAt = new Date().toISOString();
      
      if (reason) {
        consent.consentData.additionalNotes = 
          `Revoked: ${reason}\n${consent.consentData.additionalNotes || ''}`;
      }

      await this.updateConsentRecord(consent);
    } catch (error) {
      console.error('Error revoking consent:', error);
      throw error;
    }
  }

  /**
   * Check if consent needs renewal
   */
  async checkConsentRenewal(petId: string): Promise<{
    needsRenewal: boolean;
    daysUntilExpiration?: number;
    consent?: ConsentRecord;
  }> {
    try {
      const activeConsent = await this.getActiveConsentByPetId(petId);
      
      if (!activeConsent) {
        return { needsRenewal: true };
      }

      const now = new Date();
      const expiresAt = new Date(activeConsent.expiresAt);
      const daysUntilExpiration = Math.floor(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Needs renewal if within 30 days of expiration
      const needsRenewal = daysUntilExpiration <= 30;

      // Mark notification as sent if within renewal window
      if (needsRenewal && !activeConsent.renewalNotificationSent) {
        activeConsent.renewalNotificationSent = true;
        activeConsent.status = ConsentStatus.PENDING_RENEWAL;
        await this.updateConsentRecord(activeConsent);
      }

      return {
        needsRenewal,
        daysUntilExpiration,
        consent: activeConsent,
      };
    } catch (error) {
      console.error('Error checking consent renewal:', error);
      return { needsRenewal: true };
    }
  }

  /**
   * Renew consent (create new consent based on existing one)
   */
  async renewConsent(
    oldConsentId: string,
    signatureDataUrl: string,
    ipAddress: string = '0.0.0.0'
  ): Promise<ConsentRecord> {
    try {
      const oldConsent = await this.getConsentById(oldConsentId);
      
      if (!oldConsent) {
        throw new Error('Original consent record not found');
      }

      // Mark old consent as expired
      oldConsent.status = ConsentStatus.EXPIRED;
      await this.updateConsentRecord(oldConsent);

      // Create new consent with same data
      return await this.createConsent(
        oldConsent.petId,
        oldConsent.ownerId,
        oldConsent.consentData,
        signatureDataUrl,
        ipAddress
      );
    } catch (error) {
      console.error('Error renewing consent:', error);
      throw error;
    }
  }

  /**
   * Generate consent PDF (mock implementation)
   */
  private async generateConsentPDF(consent: ConsentRecord): Promise<string> {
    // In a real app, this would generate an actual PDF
    // For now, return a mock URL
    return `https://mock-storage.com/consents/${consent.consentId}.pdf`;
  }

  /**
   * Email consent copy to owner
   */
  async emailConsentCopy(consentId: string, email: string): Promise<void> {
    try {
      const consent = await this.getConsentById(consentId);
      
      if (!consent) {
        throw new Error('Consent record not found');
      }

      // In a real app, this would send an actual email
      console.log(`Emailing consent ${consentId} to ${email}`);
      console.log(`PDF URL: ${consent.pdfUrl}`);
      
      // Mock success
      return Promise.resolve();
    } catch (error) {
      console.error('Error emailing consent:', error);
      throw error;
    }
  }

  /**
   * Get consent statistics for owner
   */
  async getConsentStats(ownerId: string): Promise<{
    totalConsents: number;
    activeConsents: number;
    expiredConsents: number;
    revokedConsents: number;
    pendingRenewal: number;
  }> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: ConsentRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      const ownerConsents = records.filter(r => r.ownerId === ownerId);

      return {
        totalConsents: ownerConsents.length,
        activeConsents: ownerConsents.filter(r => r.status === ConsentStatus.ACTIVE).length,
        expiredConsents: ownerConsents.filter(r => r.status === ConsentStatus.EXPIRED).length,
        revokedConsents: ownerConsents.filter(r => r.status === ConsentStatus.REVOKED).length,
        pendingRenewal: ownerConsents.filter(r => r.status === ConsentStatus.PENDING_RENEWAL).length,
      };
    } catch (error) {
      console.error('Error getting consent stats:', error);
      return {
        totalConsents: 0,
        activeConsents: 0,
        expiredConsents: 0,
        revokedConsents: 0,
        pendingRenewal: 0,
      };
    }
  }

  /**
   * Save consent record
   */
  private async saveConsentRecord(record: ConsentRecord): Promise<void> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: ConsentRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      records.push(record);
      await storageService.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving consent record:', error);
      throw error;
    }
  }

  /**
   * Update consent record
   */
  private async updateConsentRecord(record: ConsentRecord): Promise<void> {
    try {
      const recordsJson = await storageService.getItem(STORAGE_KEY);
      const records: ConsentRecord[] = recordsJson ? JSON.parse(recordsJson) : [];
      
      const index = records.findIndex(r => r.consentId === record.consentId);
      if (index !== -1) {
        record.updatedAt = new Date().toISOString();
        records[index] = record;
        await storageService.setItem(STORAGE_KEY, JSON.stringify(records));
      }
    } catch (error) {
      console.error('Error updating consent record:', error);
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
}

export const ConsentService = new ConsentServiceClass();
