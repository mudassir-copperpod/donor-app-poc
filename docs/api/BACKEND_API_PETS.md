# Backend API - Pet Profile Management

## Base URL
`/v1/pets`

**Authentication Required:** All endpoints require `Authorization: Bearer <token>`

---

## Endpoints

### 1. Get All Pets for Current User

**GET** `/v1/pets`

Returns all pets owned by the authenticated user.

**Query Parameters:**
- `species` (optional): Filter by species (DOG, CAT, HORSE)
- `eligibilityStatus` (optional): Filter by eligibility status
- `search` (optional): Search by name or breed

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "petId": "uuid-here",
      "ownerId": "user-uuid",
      "name": "Max",
      "species": "DOG",
      "breed": "Golden Retriever",
      "dateOfBirth": "2020-03-15",
      "age": 5,
      "sex": "NEUTERED_MALE",
      "weightHistory": [
        {
          "weight": 75,
          "unit": "lbs",
          "date": "2025-11-01"
        }
      ],
      "currentWeight": 75,
      "color": "Golden",
      "markings": "White chest patch",
      "microchipNumber": "123456789012345",
      "photoUrl": "https://cdn.donor-app.com/pets/uuid.jpg",
      "veterinarianInfo": {
        "veterinarianName": "Dr. Smith",
        "clinicName": "Happy Paws Clinic",
        "clinicPhone": "+1-555-0100",
        "clinicEmail": "contact@happypaws.com",
        "licenseNumber": "VET12345",
        "permissionToContact": true
      },
      "bloodType": "DOG_DEA_1_1_NEGATIVE",
      "eligibilityStatus": "ELIGIBLE",
      "eligibilityNotes": "Universal donor",
      "nextReviewDate": "2026-11-01",
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-11-01T15:30:00Z"
    }
  ]
}
```

---

### 2. Get Pet by ID

**GET** `/v1/pets/:petId`

**Response:** `200 OK` (same structure as single pet above)

**Error:** `404 Not Found` if pet doesn't exist or doesn't belong to user

---

### 3. Create Pet Profile

**POST** `/v1/pets`

**Request Body:**
```json
{
  "name": "Max",
  "species": "DOG",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-03-15",
  "sex": "NEUTERED_MALE",
  "currentWeight": 75,
  "weightUnit": "lbs",
  "color": "Golden",
  "markings": "White chest patch",
  "microchipNumber": "123456789012345",
  "photoUrl": "https://cdn.donor-app.com/pets/uuid.jpg",
  "veterinarianInfo": {
    "veterinarianName": "Dr. Smith",
    "clinicName": "Happy Paws Clinic",
    "clinicPhone": "+1-555-0100",
    "clinicEmail": "contact@happypaws.com",
    "licenseNumber": "VET12345",
    "permissionToContact": true
  },
  "bloodType": "UNKNOWN"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "petId": "new-uuid",
    "ownerId": "user-uuid",
    "name": "Max",
    "species": "DOG",
    "eligibilityStatus": "PENDING_REVIEW",
    ...
  },
  "message": "Pet profile created successfully"
}
```

**Validation Rules:**
- `name`: Required, 1-50 characters
- `species`: Required, must be valid enum value
- `breed`: Required, 1-100 characters
- `dateOfBirth`: Required, must be in past, not more than 25 years ago
- `sex`: Required, valid enum
- `currentWeight`: Required, positive number
- `veterinarianInfo`: All fields required except licenseNumber

---

### 4. Update Pet Profile

**PATCH** `/v1/pets/:petId`

Partial update of pet information.

**Request Body:** (any subset of fields)
```json
{
  "currentWeight": 77,
  "color": "Golden with grey muzzle",
  "veterinarianInfo": {
    "clinicPhone": "+1-555-0199"
  }
}
```

**Response:** `200 OK` (returns updated pet object)

**Note:** Weight updates automatically add to `weightHistory` array

---

### 5. Upload Pet Photo

**POST** `/v1/pets/:petId/photo`

**Headers:** `Content-Type: multipart/form-data`

**Request Body:**
```
photo: <file> (image/jpeg, image/png, max 10MB)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "photoUrl": "https://cdn.donor-app.com/pets/uuid.jpg",
    "thumbnailUrl": "https://cdn.donor-app.com/pets/uuid-thumb.jpg"
  }
}
```

---

### 6. Delete Pet Profile

**DELETE** `/v1/pets/:petId`

Soft deletes pet profile (marks as inactive, preserves donation history).

**Response:** `204 No Content`

**Note:** Cannot delete if pet has upcoming appointments

---

### 7. Get Pet Donation History

**GET** `/v1/pets/:petId/donations`

Returns all donation records for a specific pet.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional): Filter by donation status

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "donationId": "uuid",
      "appointmentId": "appt-uuid",
      "petId": "pet-uuid",
      "facilityId": "facility-uuid",
      "donationDate": "2025-10-15T14:00:00Z",
      "donationStatus": "ACCEPTED",
      "usageStatus": "USED",
      "nextEligibleDate": "2025-12-10"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 8. Get Pet Appointments

**GET** `/v1/pets/:petId/appointments`

Returns all appointments for a specific pet.

**Query Parameters:**
- `status` (optional): SCHEDULED, CONFIRMED, COMPLETED, CANCELLED
- `upcoming` (boolean): If true, only return future appointments

**Response:** `200 OK` (array of appointment objects)

---

### 9. Check Pet Eligibility Status

**GET** `/v1/pets/:petId/eligibility`

Returns current eligibility status with details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "petId": "uuid",
    "eligibilityStatus": "ELIGIBLE",
    "lastEligibilityCheck": "2025-10-01T10:00:00Z",
    "nextReviewDate": "2026-10-01",
    "disqualifyingFactors": [],
    "canDonateNow": true,
    "nextEligibleDonationDate": "2025-11-15",
    "eligibilityNotes": "Universal donor - highly valuable"
  }
}
```

---

## TypeScript Types Reference

See `/types/pet.types.ts`:

```typescript
enum Species {
  DOG = 'DOG',
  CAT = 'CAT',
  HORSE = 'HORSE',
  RABBIT = 'RABBIT',
  FERRET = 'FERRET',
  GOAT = 'GOAT',
  SHEEP = 'SHEEP',
  PIG = 'PIG',
  COW = 'COW',
  LLAMA = 'LLAMA',
  ALPACA = 'ALPACA',
}

enum Sex {
  MALE = 'MALE',
  NEUTERED_MALE = 'NEUTERED_MALE',
  FEMALE = 'FEMALE',
  SPAYED_FEMALE = 'SPAYED_FEMALE',
}

enum EligibilityStatus {
  ELIGIBLE = 'ELIGIBLE',
  PENDING_REVIEW = 'PENDING_REVIEW',
  TEMPORARILY_INELIGIBLE = 'TEMPORARILY_INELIGIBLE',
  INELIGIBLE = 'INELIGIBLE',
  RE_VERIFICATION_REQUIRED = 'RE_VERIFICATION_REQUIRED',
}

enum BloodType {
  // Dogs
  DOG_DEA_1_1_POSITIVE = 'DOG_DEA_1_1_POSITIVE',
  DOG_DEA_1_1_NEGATIVE = 'DOG_DEA_1_1_NEGATIVE',
  DOG_UNIVERSAL_DONOR = 'DOG_UNIVERSAL_DONOR',
  
  // Cats
  CAT_TYPE_A = 'CAT_TYPE_A',
  CAT_TYPE_B = 'CAT_TYPE_B',
  CAT_TYPE_AB = 'CAT_TYPE_AB',
  
  // Horses
  HORSE_AA_POSITIVE = 'HORSE_AA_POSITIVE',
  HORSE_QA_POSITIVE = 'HORSE_QA_POSITIVE',
  
  UNKNOWN = 'UNKNOWN',
}
```

---

## Database Schema

```sql
CREATE TABLE pets (
  pet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  species VARCHAR(20) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  age INTEGER GENERATED ALWAYS AS (
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth))
  ) STORED,
  sex VARCHAR(20) NOT NULL,
  
  -- Weight tracking
  weight_history JSONB NOT NULL DEFAULT '[]',
  current_weight DECIMAL(6,2) NOT NULL,
  
  color VARCHAR(100),
  markings TEXT,
  microchip_number VARCHAR(15),
  photo_url TEXT,
  
  -- Veterinarian info (JSONB)
  veterinarian_info JSONB NOT NULL,
  
  blood_type VARCHAR(30) DEFAULT 'UNKNOWN',
  eligibility_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW',
  eligibility_notes TEXT,
  next_review_date DATE,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(user_id),
  CONSTRAINT valid_species CHECK (species IN ('DOG', 'CAT', 'HORSE', 'RABBIT', 'FERRET', 'GOAT', 'SHEEP', 'PIG', 'COW', 'LLAMA', 'ALPACA')),
  CONSTRAINT valid_sex CHECK (sex IN ('MALE', 'NEUTERED_MALE', 'FEMALE', 'SPAYED_FEMALE')),
  CONSTRAINT valid_eligibility CHECK (eligibility_status IN ('ELIGIBLE', 'PENDING_REVIEW', 'TEMPORARILY_INELIGIBLE', 'INELIGIBLE', 'RE_VERIFICATION_REQUIRED')),
  CONSTRAINT positive_weight CHECK (current_weight > 0)
);

CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_eligibility_status ON pets(eligibility_status);
CREATE INDEX idx_pets_blood_type ON pets(blood_type);
CREATE INDEX idx_pets_is_active ON pets(is_active);
```

---

## Business Logic Notes

1. **Age Calculation:** Automatically calculated from `dateOfBirth`
2. **Weight History:** Each weight update adds entry with timestamp
3. **Eligibility Status:** Updated after questionnaire submission or vet review
4. **Photo Storage:** Images stored in CDN, URLs saved in database
5. **Soft Delete:** `is_active` flag prevents hard deletion of donation history
6. **Next Review Date:** Set based on eligibility status and species requirements
