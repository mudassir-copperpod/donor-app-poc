# Backend API - Appointments & Donations

## Appointments

**Base URL:** `/v1/appointments`

---

### 1. Book Appointment

**POST** `/v1/appointments`

**Request Body:**
```json
{
  "petId": "pet-uuid",
  "facilityId": "facility-uuid",
  "dateTime": "2025-11-15T14:00:00Z",
  "type": "ROUTINE",
  "specialInstructions": "Pet is nervous around other animals",
  "preAppointmentChecklist": {
    "feedPetFullMeal": true,
    "ensureHydration": true,
    "bringVaccinationRecords": true,
    "bringMedicationsList": true,
    "noteHealthChanges": false
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "appointmentId": "uuid",
    "petId": "pet-uuid",
    "facilityId": "facility-uuid",
    "dateTime": "2025-11-15T14:00:00Z",
    "type": "ROUTINE",
    "status": "SCHEDULED",
    "estimatedDuration": 45,
    "remindersSent": [],
    "preInstructionsSent": false,
    "createdAt": "2025-11-04T12:00:00Z"
  },
  "message": "Appointment booked successfully"
}
```

**Validation:**
- Pet must be ELIGIBLE
- Pet must have active consent
- Facility must accept pet's species
- DateTime must be in future
- Check for conflicts (same pet, overlapping time)

---

### 2. Get Appointment by ID

**GET** `/v1/appointments/:appointmentId`

**Response:** `200 OK`

---

### 3. Get User's Appointments

**GET** `/v1/appointments`

**Query Parameters:**
- `status`: SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
- `upcoming`: boolean (default: false)
- `petId`: filter by specific pet
- `page`, `limit`: pagination

**Response:** `200 OK` (paginated list)

---

### 4. Update Appointment

**PATCH** `/v1/appointments/:appointmentId`

**Request Body:**
```json
{
  "dateTime": "2025-11-16T10:00:00Z",
  "specialInstructions": "Updated instructions"
}
```

**Response:** `200 OK`

**Note:** Cannot update if within 24 hours of appointment

---

### 5. Cancel Appointment

**POST** `/v1/appointments/:appointmentId/cancel`

**Request Body:**
```json
{
  "cancellationReason": "Pet is sick"
}
```

**Response:** `200 OK`

**Business Logic:**
- Cancellation within 24 hours may incur penalty
- Sends cancellation notification to facility
- Updates appointment status to CANCELLED

---

### 6. Confirm Appointment (Facility)

**POST** `/v1/appointments/:appointmentId/confirm`

**Response:** `200 OK`

**Note:** Changes status from SCHEDULED to CONFIRMED

---

### 7. Check-in Appointment (Facility)

**POST** `/v1/appointments/:appointmentId/checkin`

**Request Body:**
```json
{
  "checkInTime": "2025-11-15T13:55:00Z"
}
```

**Response:** `200 OK`

---

### 8. Complete Appointment (Facility)

**POST** `/v1/appointments/:appointmentId/complete`

**Request Body:**
```json
{
  "completedTime": "2025-11-15T14:45:00Z",
  "notes": "Donation successful"
}
```

**Response:** `200 OK`

**Side Effect:** Triggers donation record creation workflow

---

## Donations

**Base URL:** `/v1/donations`

---

### 9. Create Donation Record (Facility/Admin)

**POST** `/v1/donations`

**Request Body:**
```json
{
  "appointmentId": "appt-uuid",
  "petId": "pet-uuid",
  "facilityId": "facility-uuid",
  "donationDate": "2025-11-15T14:00:00Z",
  "preExamResults": {
    "weight": 76,
    "temperature": 101.5,
    "heartRate": 80,
    "overallHealth": "Excellent",
    "notes": "Pet in great condition"
  },
  "collectionDetails": {
    "volumeCollected": 450,
    "collectionMethod": "Jugular venipuncture",
    "duration": 15,
    "sedationUsed": false
  },
  "bloodTypingResults": "DOG_DEA_1_1_NEGATIVE",
  "labScreeningResults": {
    "completedBloodCount": {
      "RBC": "7.2 M/µL",
      "WBC": "8.5 K/µL",
      "Platelets": "250 K/µL"
    },
    "bloodChemistryPanel": {
      "ALT": "45 U/L",
      "BUN": "18 mg/dL"
    },
    "infectiousDiseaseScreening": {
      "Heartworm": "Negative",
      "Ehrlichia": "Negative"
    }
  },
  "postObservationNotes": "Pet recovered well, no adverse reactions",
  "adverseReactions": "None",
  "donationStatus": "ACCEPTED",
  "usageStatus": "STORED",
  "attendingVeterinarian": "Dr. Jane Smith"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "donationId": "uuid",
    "appointmentId": "appt-uuid",
    "petId": "pet-uuid",
    "donationDate": "2025-11-15T14:00:00Z",
    "donationStatus": "ACCEPTED",
    "nextEligibleDate": "2026-01-10",
    "createdAt": "2025-11-15T15:00:00Z"
  }
}
```

**Business Logic:**
- Updates pet's blood type if first donation
- Calculates next eligible donation date (8-12 weeks)
- Sends thank you notification to owner
- Updates facility inventory

---

### 10. Get Donation by ID

**GET** `/v1/donations/:donationId`

**Response:** `200 OK` (full donation record)

---

### 11. Get Pet's Donation History

**GET** `/v1/pets/:petId/donations`

**Query Parameters:**
- `page`, `limit`: pagination
- `status`: ACCEPTED, DECLINED
- `usageStatus`: USED, STORED, EXPIRED

**Response:** `200 OK` (paginated list)

---

### 12. Get User's All Donations

**GET** `/v1/donations`

Returns donations for all user's pets.

**Response:** `200 OK`

---

### 13. Get Donation Statistics

**GET** `/v1/donations/stats`

**Query Parameters:**
- `petId` (optional): stats for specific pet
- `period`: 'all', 'year', 'month'

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalDonations": 12,
    "totalVolumeCollected": 5400,
    "estimatedLivesSaved": 36,
    "lastDonationDate": "2025-11-15",
    "nextEligibleDate": "2026-01-10",
    "donationStreak": 3,
    "averageDonationInterval": 65,
    "byStatus": {
      "ACCEPTED": 11,
      "DECLINED": 1
    },
    "byUsage": {
      "USED": 8,
      "STORED": 3,
      "EXPIRED": 0
    }
  }
}
```

---

### 14. Update Donation Usage Status (Facility)

**PATCH** `/v1/donations/:donationId/usage`

**Request Body:**
```json
{
  "usageStatus": "USED",
  "usageNotes": "Used for emergency transfusion - German Shepherd surgery"
}
```

**Response:** `200 OK`

---

## Facilities

**Base URL:** `/v1/facilities`

---

### 15. Get All Facilities

**GET** `/v1/facilities`

**Query Parameters:**
- `species`: Filter by accepted species
- `inventoryStatus`: CRITICAL, LOW, ADEQUATE, GOOD
- `latitude`, `longitude`, `radius`: Geolocation search
- `bloodType`: Filter by needed blood type
- `page`, `limit`: Pagination

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "facilityId": "uuid",
      "name": "Happy Paws Veterinary Hospital",
      "credentials": ["AABB Certified", "AVMA Member"],
      "licenseNumber": "VET-CA-12345",
      "address": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94102",
        "country": "USA"
      },
      "contactPhone": "+1-555-0100",
      "contactEmail": "contact@happypaws.com",
      "operatingHours": { /* ... */ },
      "emergencyHours": {
        "available24_7": true,
        "emergencyPhone": "+1-555-0101"
      },
      "capabilities": {
        "sedationAvailable": true,
        "speciesAccepted": ["DOG", "CAT"],
        "onSiteVisits": false,
        "emergencyServices": true
      },
      "bloodTypesNeeded": ["DOG_DEA_1_1_NEGATIVE", "CAT_TYPE_B"],
      "inventoryStatus": "LOW",
      "rating": 4.8,
      "reviewCount": 156,
      "verificationStatus": "VERIFIED",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "distance": 2.5
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### 16. Get Facility by ID

**GET** `/v1/facilities/:facilityId`

**Response:** `200 OK`

---

### 17. Get Facility Availability

**GET** `/v1/facilities/:facilityId/availability`

**Query Parameters:**
- `date`: YYYY-MM-DD
- `species`: DOG, CAT, HORSE

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "date": "2025-11-15",
    "availableSlots": [
      {
        "time": "09:00",
        "available": true
      },
      {
        "time": "10:00",
        "available": false
      },
      {
        "time": "14:00",
        "available": true
      }
    ]
  }
}
```

---

## Database Schemas

### appointments table

```sql
CREATE TABLE appointments (
  appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(pet_id),
  facility_id UUID NOT NULL REFERENCES facilities(facility_id),
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
  
  reminders_sent JSONB DEFAULT '[]',
  pre_instructions_sent BOOLEAN DEFAULT FALSE,
  
  check_in_time TIMESTAMP WITH TIME ZONE,
  completed_time TIMESTAMP WITH TIME ZONE,
  
  cancelled_by UUID REFERENCES users(user_id),
  cancellation_reason TEXT,
  
  estimated_duration INTEGER DEFAULT 45,
  special_instructions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_type CHECK (type IN ('ROUTINE', 'EMERGENCY', 'SCREENING', 'FOLLOWUP')),
  CONSTRAINT valid_status CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'))
);

CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_facility_id ON appointments(facility_id);
CREATE INDEX idx_appointments_date_time ON appointments(date_time);
CREATE INDEX idx_appointments_status ON appointments(status);
```

### donation_records table

```sql
CREATE TABLE donation_records (
  donation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(appointment_id),
  pet_id UUID NOT NULL REFERENCES pets(pet_id),
  facility_id UUID NOT NULL REFERENCES facilities(facility_id),
  donation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  pre_exam_results JSONB NOT NULL,
  collection_details JSONB NOT NULL,
  blood_typing_results VARCHAR(30),
  lab_screening_results JSONB,
  
  post_observation_notes TEXT,
  adverse_reactions TEXT,
  
  donation_status VARCHAR(20) NOT NULL,
  usage_status VARCHAR(20) NOT NULL DEFAULT 'STORED',
  usage_notes TEXT,
  
  attending_veterinarian VARCHAR(100) NOT NULL,
  next_eligible_date DATE NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_donation_status CHECK (donation_status IN ('ACCEPTED', 'DECLINED')),
  CONSTRAINT valid_usage_status CHECK (usage_status IN ('USED', 'STORED', 'EXPIRED'))
);

CREATE INDEX idx_donations_pet_id ON donation_records(pet_id);
CREATE INDEX idx_donations_facility_id ON donation_records(facility_id);
CREATE INDEX idx_donations_date ON donation_records(donation_date DESC);
CREATE INDEX idx_donations_status ON donation_records(donation_status);
```

### facilities table

```sql
CREATE TABLE facilities (
  facility_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  credentials JSONB DEFAULT '[]',
  license_number VARCHAR(50) NOT NULL UNIQUE,
  
  address JSONB NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  
  operating_hours JSONB NOT NULL,
  emergency_hours JSONB,
  
  capabilities JSONB NOT NULL,
  blood_types_needed JSONB DEFAULT '[]',
  inventory_status VARCHAR(20) DEFAULT 'ADEQUATE',
  
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  
  photos JSONB DEFAULT '[]',
  accessibility_features JSONB DEFAULT '[]',
  
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_inventory CHECK (inventory_status IN ('CRITICAL', 'LOW', 'ADEQUATE', 'GOOD')),
  CONSTRAINT valid_verification CHECK (verification_status IN ('VERIFIED', 'PENDING', 'UNVERIFIED'))
);

CREATE INDEX idx_facilities_location ON facilities USING GIST (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_facilities_inventory_status ON facilities(inventory_status);
CREATE INDEX idx_facilities_verification_status ON facilities(verification_status);
```

---

## Business Logic Notes

1. **Next Eligible Date Calculation:** 8-12 weeks based on species and volume collected
2. **Appointment Reminders:** Automated at 48hr, 24hr, 2hr before appointment
3. **Inventory Management:** Facilities update blood type needs based on current inventory
4. **Geolocation Search:** Use PostGIS or similar for radius-based facility search
5. **Donation Impact:** Lives saved = volume collected / 150ml (average transfusion unit)
