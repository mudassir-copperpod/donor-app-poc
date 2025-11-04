# Backend API - Eligibility & Consent Management

## Eligibility Endpoints

**Base URL:** `/v1/eligibility`

**Authentication Required:** All endpoints

---

### 1. Submit Eligibility Questionnaire

**POST** `/v1/eligibility/questionnaire`

Submits species-specific health screening questionnaire.

**Request Body (Dog Example):**
```json
{
  "petId": "pet-uuid",
  "questionnaireResponse": {
    "species": "DOG",
    "goodPhysicalHealth": true,
    "noChronicConditions": true,
    "noRecentIllness": true,
    "friendlyTemperament": true,
    "comfortableWithRestraint": true,
    "currentOnVaccinations": true,
    "vaccinationCertificateUrl": "https://cdn.donor-app.com/docs/vax-cert.pdf",
    "onlyRoutineMedications": true,
    "medicationsList": ["Heartgard", "NexGard"],
    "neverReceivedTransfusion": true,
    "recentTravelHistory": "None",
    "spayedNeutered": true,
    "notPregnantOrNursing": true,
    "heartwormTestNegative": true,
    "heartwormTestDate": "2025-09-01",
    "tickBorneDiseaseNegative": true,
    "dietType": "COMMERCIAL",
    "activityLevel": "HIGH",
    "exerciseRoutine": "Daily 2-mile walks",
    "behavioralNotes": "Friendly with all people and animals"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "eligibilityId": "uuid",
    "petId": "pet-uuid",
    "submittedAt": "2025-11-04T12:00:00Z",
    "overallStatus": "ELIGIBLE",
    "disqualifyingFactors": [],
    "reviewNotes": "All criteria met. Universal donor candidate.",
    "nextReviewDate": "2026-11-04"
  },
  "message": "Eligibility questionnaire submitted successfully"
}
```

**Auto-Calculated Disqualifying Factors:**
- Age/weight out of range → PERMANENT or TEMPORARY
- Positive disease tests → PERMANENT
- Recent transfusion → PERMANENT
- Pregnancy/nursing → TEMPORARY
- Recent illness → TEMPORARY
- Medications beyond preventatives → PENDING_REVIEW

---

### 2. Get Eligibility Record

**GET** `/v1/eligibility/:eligibilityId`

**Response:** `200 OK` (full eligibility record with questionnaire responses)

---

### 3. Get Pet's Latest Eligibility

**GET** `/v1/pets/:petId/eligibility/latest`

Returns most recent eligibility record for a pet.

**Response:** `200 OK`

---

### 4. Update Eligibility Status (Admin/Vet Only)

**PATCH** `/v1/eligibility/:eligibilityId/status`

Allows veterinary staff to review and update eligibility.

**Request Body:**
```json
{
  "overallStatus": "ELIGIBLE",
  "reviewNotes": "Approved after vet consultation",
  "nextReviewDate": "2026-11-04",
  "reviewedBy": "vet-user-id"
}
```

**Response:** `200 OK`

---

## Consent Endpoints

**Base URL:** `/v1/consent`

---

### 5. Create Consent Record

**POST** `/v1/consent`

Creates and stores digital consent form.

**Request Body:**
```json
{
  "petId": "pet-uuid",
  "consentData": {
    "ownerCertification": true,
    "authorizedAgent": false,
    "authorizesBloodCollection": true,
    "authorizesSedation": true,
    "authorizesPreExam": true,
    "authorizesBloodScreening": true,
    "understandsRisks": true,
    "risksExplained": true,
    "commitsToProgram": true,
    "understandsFrequencyLimits": true,
    "agreesToNotifyHealthChanges": true,
    "acknowledgesCancellationPolicy": true,
    "allowsPublicity": false,
    "additionalNotes": "Please call before sedation"
  },
  "signatureDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "ipAddress": "192.168.1.1",
  "consentFormVersion": "1.0.0"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "consentId": "uuid",
    "petId": "pet-uuid",
    "ownerId": "user-uuid",
    "signedAt": "2025-11-04T12:30:00Z",
    "status": "ACTIVE",
    "expiresAt": "2026-11-04T12:30:00Z",
    "pdfUrl": "https://cdn.donor-app.com/consents/uuid.pdf"
  },
  "message": "Consent form signed successfully"
}
```

**Business Logic:**
- Expiration: 12 months from signing
- PDF generation: Automatic on creation
- Email copy: Sent to owner's email
- Signature validation: Base64 image required

---

### 6. Get Consent Record

**GET** `/v1/consent/:consentId`

**Response:** `200 OK` (full consent record)

---

### 7. Get Pet's Active Consent

**GET** `/v1/pets/:petId/consent/active`

Returns currently active consent for a pet.

**Response:** `200 OK` or `404 Not Found`

---

### 8. Get All Consents for Pet

**GET** `/v1/pets/:petId/consents`

Returns consent history (active, expired, revoked).

**Response:** `200 OK` (array of consent records)

---

### 9. Revoke Consent

**POST** `/v1/consent/:consentId/revoke`

Revokes active consent (owner withdraws from program).

**Request Body:**
```json
{
  "reason": "Pet health concerns"
}
```

**Response:** `200 OK`

**Side Effects:**
- Cancels all future appointments
- Updates pet eligibility status to INELIGIBLE
- Sends confirmation email

---

### 10. Renew Consent

**POST** `/v1/consent/:consentId/renew`

Renews expiring consent (simplified process).

**Request Body:**
```json
{
  "consentData": { /* updated consent data */ },
  "signatureDataUrl": "data:image/png;base64,..."
}
```

**Response:** `201 Created` (new consent record)

---

## TypeScript Types Reference

See `/types/eligibility.types.ts` and `/types/consent.types.ts`

---

## Database Schema

### eligibility_records table

```sql
CREATE TABLE eligibility_records (
  eligibility_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(pet_id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Questionnaire responses (JSONB for flexibility)
  questionnaire_response JSONB NOT NULL,
  
  -- Disqualifying factors (array of objects)
  disqualifying_factors JSONB DEFAULT '[]',
  
  overall_status VARCHAR(30) NOT NULL,
  review_notes TEXT,
  next_review_date DATE,
  
  reviewed_by UUID REFERENCES users(user_id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_pet FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
  CONSTRAINT valid_status CHECK (overall_status IN ('ELIGIBLE', 'PENDING_REVIEW', 'TEMPORARILY_INELIGIBLE', 'INELIGIBLE'))
);

CREATE INDEX idx_eligibility_pet_id ON eligibility_records(pet_id);
CREATE INDEX idx_eligibility_status ON eligibility_records(overall_status);
CREATE INDEX idx_eligibility_submitted_at ON eligibility_records(submitted_at DESC);
```

### consent_records table

```sql
CREATE TABLE consent_records (
  consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(pet_id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- Consent form data (JSONB)
  consent_data JSONB NOT NULL,
  
  signature_data_url TEXT NOT NULL,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET NOT NULL,
  consent_form_version VARCHAR(10) NOT NULL,
  
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  renewal_notification_sent BOOLEAN DEFAULT FALSE,
  
  pdf_url TEXT,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revocation_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_pet FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(user_id),
  CONSTRAINT valid_status CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED', 'PENDING_RENEWAL'))
);

CREATE INDEX idx_consent_pet_id ON consent_records(pet_id);
CREATE INDEX idx_consent_owner_id ON consent_records(owner_id);
CREATE INDEX idx_consent_status ON consent_records(status);
CREATE INDEX idx_consent_expires_at ON consent_records(expires_at);

-- Unique active consent per pet
CREATE UNIQUE INDEX idx_consent_active_pet ON consent_records(pet_id) 
WHERE status = 'ACTIVE';
```

---

## Business Logic Notes

### Eligibility Calculation Rules

**Dogs:**
- Age: 1-8 years
- Weight: Minimum 55 lbs
- Must be spayed/neutered
- Heartworm negative
- No raw food diet (flag for review)

**Cats:**
- Age: 1-8 years
- Weight: Minimum 10 lbs
- Must be spayed/neutered
- Indoor-only required
- FeLV/FIV negative

**Horses:**
- Age: 2-20 years
- Weight: Minimum 800 lbs
- Current Coggins test (within 12 months)
- EIA negative

### Consent Expiration Workflow

1. **90 days before expiry:** Send renewal reminder email
2. **30 days before expiry:** Status changes to PENDING_RENEWAL
3. **On expiry date:** Status changes to EXPIRED
4. **After expiry:** Cannot book new appointments until renewed
