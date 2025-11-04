# Complete Database Schema

## Overview

This document provides the complete PostgreSQL database schema for the Donor App backend.

**Database:** PostgreSQL 14+  
**Extensions Required:** `uuid-ossp`, `postgis` (for geolocation), `pg_trgm` (for text search)

---

## Setup SQL

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## Complete Schema

### 1. users

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  relationship VARCHAR(20) NOT NULL CHECK (relationship IN ('OWNER', 'AUTHORIZED_AGENT')),
  
  contact_info JSONB NOT NULL,
  emergency_contact JSONB NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  
  digital_signature TEXT,
  account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  registration_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT valid_account_status CHECK (account_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  CONSTRAINT valid_registration_status CHECK (registration_status IN ('PENDING', 'APPROVED', 'REJECTED', 'INCOMPLETE'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_status ON users(account_status);
CREATE INDEX idx_users_registration_status ON users(registration_status);

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. refresh_tokens

```sql
CREATE TABLE refresh_tokens (
  token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked_at ON refresh_tokens(revoked_at);
```

### 3. pets

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
  
  weight_history JSONB NOT NULL DEFAULT '[]',
  current_weight DECIMAL(6,2) NOT NULL,
  
  color VARCHAR(100),
  markings TEXT,
  microchip_number VARCHAR(15),
  photo_url TEXT,
  
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
  CONSTRAINT positive_weight CHECK (current_weight > 0),
  CONSTRAINT valid_dob CHECK (date_of_birth <= CURRENT_DATE)
);

CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_eligibility_status ON pets(eligibility_status);
CREATE INDEX idx_pets_blood_type ON pets(blood_type);
CREATE INDEX idx_pets_is_active ON pets(is_active);
CREATE INDEX idx_pets_name_trgm ON pets USING gin (name gin_trgm_ops);

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. eligibility_records

```sql
CREATE TABLE eligibility_records (
  eligibility_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(pet_id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  questionnaire_response JSONB NOT NULL,
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

CREATE TRIGGER update_eligibility_updated_at BEFORE UPDATE ON eligibility_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. consent_records

```sql
CREATE TABLE consent_records (
  consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(pet_id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
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

CREATE UNIQUE INDEX idx_consent_active_pet ON consent_records(pet_id) 
WHERE status = 'ACTIVE';

CREATE TRIGGER update_consent_updated_at BEFORE UPDATE ON consent_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 6. facilities

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
  location GEOGRAPHY(POINT, 4326),
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_inventory CHECK (inventory_status IN ('CRITICAL', 'LOW', 'ADEQUATE', 'GOOD')),
  CONSTRAINT valid_verification CHECK (verification_status IN ('VERIFIED', 'PENDING', 'UNVERIFIED')),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_facilities_location ON facilities USING GIST (location);
CREATE INDEX idx_facilities_inventory_status ON facilities(inventory_status);
CREATE INDEX idx_facilities_verification_status ON facilities(verification_status);
CREATE INDEX idx_facilities_is_active ON facilities(is_active);

-- Trigger to auto-populate location from lat/lng
CREATE OR REPLACE FUNCTION update_facility_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_facilities_location BEFORE INSERT OR UPDATE ON facilities
FOR EACH ROW EXECUTE FUNCTION update_facility_location();

CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 7. appointments

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
  pre_appointment_checklist JSONB,
  
  check_in_time TIMESTAMP WITH TIME ZONE,
  completed_time TIMESTAMP WITH TIME ZONE,
  
  cancelled_by UUID REFERENCES users(user_id),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  estimated_duration INTEGER DEFAULT 45,
  special_instructions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_pet FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
  CONSTRAINT fk_facility FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
  CONSTRAINT valid_type CHECK (type IN ('ROUTINE', 'EMERGENCY', 'SCREENING', 'FOLLOWUP')),
  CONSTRAINT valid_status CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'))
);

CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_facility_id ON appointments(facility_id);
CREATE INDEX idx_appointments_date_time ON appointments(date_time);
CREATE INDEX idx_appointments_status ON appointments(status);

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 8. donation_records

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
  usage_updated_at TIMESTAMP WITH TIME ZONE,
  
  attending_veterinarian VARCHAR(100) NOT NULL,
  next_eligible_date DATE NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
  CONSTRAINT fk_pet FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
  CONSTRAINT fk_facility FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
  CONSTRAINT valid_donation_status CHECK (donation_status IN ('ACCEPTED', 'DECLINED')),
  CONSTRAINT valid_usage_status CHECK (usage_status IN ('USED', 'STORED', 'EXPIRED'))
);

CREATE INDEX idx_donations_pet_id ON donation_records(pet_id);
CREATE INDEX idx_donations_facility_id ON donation_records(facility_id);
CREATE INDEX idx_donations_date ON donation_records(donation_date DESC);
CREATE INDEX idx_donations_status ON donation_records(donation_status);
CREATE INDEX idx_donations_usage_status ON donation_records(usage_status);

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donation_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 9. alerts

```sql
CREATE TABLE alerts (
  alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(30) NOT NULL,
  facility_id UUID REFERENCES facilities(facility_id),
  
  blood_type_needed VARCHAR(30),
  species VARCHAR(20),
  urgency_level VARCHAR(20) NOT NULL,
  radius INTEGER NOT NULL,
  
  message TEXT NOT NULL,
  title VARCHAR(200) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  
  recipient_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  
  CONSTRAINT fk_facility FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
  CONSTRAINT valid_type CHECK (type IN ('EMERGENCY', 'GENERAL_NEED', 'ELIGIBILITY_REMINDER', 'APPOINTMENT_REMINDER', 'CONSENT_RENEWAL', 'VACCINATION_REMINDER', 'THANK_YOU', 'PROGRAM_UPDATE')),
  CONSTRAINT valid_urgency CHECK (urgency_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  CONSTRAINT valid_status CHECK (status IN ('ACTIVE', 'FILLED', 'EXPIRED'))
);

CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_urgency ON alerts(urgency_level);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_expires_at ON alerts(expires_at);
CREATE INDEX idx_alerts_facility_id ON alerts(facility_id);
```

### 10. alert_responses

```sql
CREATE TABLE alert_responses (
  response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES alerts(alert_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id),
  pet_id UUID NOT NULL REFERENCES pets(pet_id),
  
  message TEXT,
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  appointment_created BOOLEAN DEFAULT FALSE,
  appointment_id UUID REFERENCES appointments(appointment_id),
  
  CONSTRAINT fk_alert FOREIGN KEY (alert_id) REFERENCES alerts(alert_id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_pet FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
);

CREATE INDEX idx_alert_responses_alert_id ON alert_responses(alert_id);
CREATE INDEX idx_alert_responses_user_id ON alert_responses(user_id);
CREATE INDEX idx_alert_responses_responded_at ON alert_responses(responded_at DESC);
```

### 11. notifications

```sql
CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  type VARCHAR(30) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  
  data JSONB,
  action_url VARCHAR(500),
  
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
```

### 12. push_devices

```sql
CREATE TABLE push_devices (
  device_id VARCHAR(100) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  device_token TEXT NOT NULL,
  platform VARCHAR(20) NOT NULL,
  
  active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT valid_platform CHECK (platform IN ('ios', 'android', 'web'))
);

CREATE INDEX idx_push_devices_user_id ON push_devices(user_id);
CREATE INDEX idx_push_devices_active ON push_devices(active);

CREATE TRIGGER update_push_devices_updated_at BEFORE UPDATE ON push_devices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Useful Views

### Active Eligible Donors

```sql
CREATE VIEW active_eligible_donors AS
SELECT 
  p.pet_id,
  p.owner_id,
  p.name,
  p.species,
  p.breed,
  p.blood_type,
  p.current_weight,
  u.full_name AS owner_name,
  u.contact_info,
  f.name AS facility_name,
  MAX(dr.donation_date) AS last_donation_date,
  MAX(dr.next_eligible_date) AS next_eligible_date
FROM pets p
JOIN users u ON p.owner_id = u.user_id
LEFT JOIN donation_records dr ON p.pet_id = dr.pet_id
LEFT JOIN facilities f ON dr.facility_id = f.facility_id
WHERE p.eligibility_status = 'ELIGIBLE'
  AND p.is_active = TRUE
  AND u.account_status = 'ACTIVE'
  AND EXISTS (
    SELECT 1 FROM consent_records cr
    WHERE cr.pet_id = p.pet_id
      AND cr.status = 'ACTIVE'
      AND cr.expires_at > NOW()
  )
GROUP BY p.pet_id, p.owner_id, p.name, p.species, p.breed, 
         p.blood_type, p.current_weight, u.full_name, u.contact_info, f.name;
```

### Upcoming Appointments

```sql
CREATE VIEW upcoming_appointments AS
SELECT 
  a.appointment_id,
  a.date_time,
  a.type,
  a.status,
  p.name AS pet_name,
  p.species,
  u.full_name AS owner_name,
  u.contact_info,
  f.name AS facility_name,
  f.address AS facility_address,
  f.contact_phone AS facility_phone
FROM appointments a
JOIN pets p ON a.pet_id = p.pet_id
JOIN users u ON p.owner_id = u.user_id
JOIN facilities f ON a.facility_id = f.facility_id
WHERE a.date_time > NOW()
  AND a.status IN ('SCHEDULED', 'CONFIRMED')
ORDER BY a.date_time;
```

---

## Seed Data (Optional)

```sql
-- Insert sample blood types needed
INSERT INTO facilities (name, license_number, address, contact_phone, contact_email, 
                       operating_hours, capabilities, latitude, longitude, verification_status)
VALUES 
('Sample Veterinary Hospital', 'VET-001', 
 '{"street": "123 Main St", "city": "San Francisco", "state": "CA", "postalCode": "94102", "country": "USA"}'::jsonb,
 '+1-555-0100', 'contact@sample-vet.com',
 '{"monday": {"open": "08:00", "close": "18:00"}}'::jsonb,
 '{"sedationAvailable": true, "speciesAccepted": ["DOG", "CAT"], "onSiteVisits": false, "emergencyServices": true}'::jsonb,
 37.7749, -122.4194, 'VERIFIED');
```

---

## Backup & Maintenance

### Daily Backup Script

```bash
#!/bin/bash
pg_dump -h localhost -U postgres donor_app | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Cleanup Old Notifications

```sql
-- Delete read notifications older than 30 days
DELETE FROM notifications 
WHERE read = TRUE 
  AND read_at < NOW() - INTERVAL '30 days';

-- Delete expired alerts
DELETE FROM alerts 
WHERE status = 'EXPIRED' 
  AND expires_at < NOW() - INTERVAL '90 days';
```

---

## Performance Optimization

### Analyze Tables Regularly

```sql
ANALYZE users;
ANALYZE pets;
ANALYZE appointments;
ANALYZE donation_records;
ANALYZE facilities;
```

### Vacuum Strategy

```sql
-- Run weekly
VACUUM ANALYZE;

-- Run monthly
VACUUM FULL;
```

---

## Security Notes

1. **Row-Level Security (RLS):** Consider implementing RLS for multi-tenant isolation
2. **Encryption:** Encrypt sensitive fields (digital_signature, signature_data_url)
3. **Audit Logging:** Add audit tables for sensitive operations
4. **Backup Encryption:** Encrypt all database backups
5. **Connection Security:** Use SSL/TLS for all database connections
