# Backend API - Alerts & Notifications

## Base URL
`/v1/alerts` and `/v1/notifications`

---

## Alert Endpoints

### 1. Get Active Alerts

**GET** `/v1/alerts`

Returns alerts relevant to the user based on their location and pet profiles.

**Query Parameters:**
- `urgencyLevel`: CRITICAL, HIGH, MEDIUM, LOW
- `type`: EMERGENCY, GENERAL_NEED, etc.
- `radius`: Override user's preference radius (in miles)
- `species`: Filter by species
- `bloodType`: Filter by blood type

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "alertId": "uuid",
      "type": "EMERGENCY",
      "facilityId": "facility-uuid",
      "facility": {
        "name": "Emergency Vet Center",
        "address": "123 Main St, San Francisco, CA"
      },
      "bloodTypeNeeded": "DOG_DEA_1_1_NEGATIVE",
      "species": "DOG",
      "urgencyLevel": "CRITICAL",
      "radius": 25,
      "message": "Urgent need for universal donor blood. Large dog in critical condition after accident.",
      "title": "🚨 Critical: Universal Donor Needed",
      "createdAt": "2025-11-04T10:00:00Z",
      "expiresAt": "2025-11-04T18:00:00Z",
      "status": "ACTIVE",
      "recipientCount": 45,
      "responseCount": 8,
      "distance": 3.2,
      "matchingPets": [
        {
          "petId": "pet-uuid",
          "name": "Max",
          "canRespond": true
        }
      ]
    }
  ]
}
```

---

### 2. Get Alert by ID

**GET** `/v1/alerts/:alertId`

**Response:** `200 OK`

---

### 3. Respond to Alert

**POST** `/v1/alerts/:alertId/respond`

User indicates they can help with the alert.

**Request Body:**
```json
{
  "petId": "pet-uuid",
  "message": "I can bring Max in within 30 minutes"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "responseId": "uuid",
    "alertId": "alert-uuid",
    "petId": "pet-uuid",
    "respondedAt": "2025-11-04T10:15:00Z",
    "suggestedAppointment": {
      "facilityId": "facility-uuid",
      "suggestedTime": "2025-11-04T10:45:00Z"
    }
  },
  "message": "Thank you for responding! The facility will contact you shortly."
}
```

---

### 4. Create Alert (Facility/Admin Only)

**POST** `/v1/alerts`

**Request Body:**
```json
{
  "type": "EMERGENCY",
  "facilityId": "facility-uuid",
  "bloodTypeNeeded": "DOG_DEA_1_1_NEGATIVE",
  "species": "DOG",
  "urgencyLevel": "CRITICAL",
  "radius": 25,
  "message": "Urgent need for universal donor blood. Large dog in critical condition.",
  "title": "Critical: Universal Donor Needed",
  "expiresAt": "2025-11-04T18:00:00Z"
}
```

**Response:** `201 Created`

**Side Effects:**
- Sends push notifications to matching users within radius
- Sends SMS to users with SMS enabled (if CRITICAL)
- Sends email notifications

---

### 5. Update Alert Status (Facility/Admin)

**PATCH** `/v1/alerts/:alertId/status`

**Request Body:**
```json
{
  "status": "FILLED",
  "notes": "Need fulfilled by 3 donors"
}
```

**Response:** `200 OK`

**Side Effects:**
- Sends thank you notifications to responders
- Sends "no longer needed" notification to others

---

## Notification Endpoints

### 6. Get User Notifications

**GET** `/v1/notifications`

**Query Parameters:**
- `read`: boolean (filter by read status)
- `type`: Filter by notification type
- `page`, `limit`: Pagination

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "notificationId": "uuid",
      "userId": "user-uuid",
      "type": "APPOINTMENT_REMINDER",
      "title": "Appointment Reminder",
      "message": "Max has an appointment tomorrow at 2:00 PM",
      "data": {
        "appointmentId": "appt-uuid",
        "petId": "pet-uuid"
      },
      "read": false,
      "actionUrl": "/appointments/appt-uuid",
      "createdAt": "2025-11-04T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "unreadCount": 5
  }
}
```

---

### 7. Mark Notification as Read

**PATCH** `/v1/notifications/:notificationId/read`

**Response:** `200 OK`

---

### 8. Mark All as Read

**POST** `/v1/notifications/read-all`

**Response:** `200 OK`

---

### 9. Delete Notification

**DELETE** `/v1/notifications/:notificationId`

**Response:** `204 No Content`

---

### 10. Get Notification Preferences

**GET** `/v1/notifications/preferences`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "pushEnabled": true,
    "emailEnabled": true,
    "smsEnabled": false,
    "emergencyAlerts": true,
    "appointmentReminders": true,
    "generalUpdates": false,
    "radius": 25,
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

---

### 11. Update Notification Preferences

**PATCH** `/v1/notifications/preferences`

**Request Body:** (partial update)
```json
{
  "smsEnabled": true,
  "radius": 50,
  "quietHours": {
    "enabled": true,
    "start": "23:00",
    "end": "07:00"
  }
}
```

**Response:** `200 OK`

---

### 12. Register Device for Push Notifications

**POST** `/v1/notifications/devices`

**Request Body:**
```json
{
  "deviceToken": "expo-push-token-here",
  "platform": "ios",
  "deviceId": "unique-device-id"
}
```

**Response:** `201 Created`

---

### 13. Unregister Device

**DELETE** `/v1/notifications/devices/:deviceId`

**Response:** `204 No Content`

---

## TypeScript Types Reference

See `/types/alert.types.ts`:

```typescript
enum AlertType {
  EMERGENCY = 'EMERGENCY',
  GENERAL_NEED = 'GENERAL_NEED',
  ELIGIBILITY_REMINDER = 'ELIGIBILITY_REMINDER',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  CONSENT_RENEWAL = 'CONSENT_RENEWAL',
  VACCINATION_REMINDER = 'VACCINATION_REMINDER',
  THANK_YOU = 'THANK_YOU',
  PROGRAM_UPDATE = 'PROGRAM_UPDATE',
}

enum UrgencyLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

enum AlertStatus {
  ACTIVE = 'ACTIVE',
  FILLED = 'FILLED',
  EXPIRED = 'EXPIRED',
}
```

---

## Database Schema

### alerts table

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
  
  CONSTRAINT valid_type CHECK (type IN ('EMERGENCY', 'GENERAL_NEED', 'ELIGIBILITY_REMINDER', 'APPOINTMENT_REMINDER', 'CONSENT_RENEWAL', 'VACCINATION_REMINDER', 'THANK_YOU', 'PROGRAM_UPDATE')),
  CONSTRAINT valid_urgency CHECK (urgency_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  CONSTRAINT valid_status CHECK (status IN ('ACTIVE', 'FILLED', 'EXPIRED'))
);

CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_urgency ON alerts(urgency_level);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_expires_at ON alerts(expires_at);
```

### alert_responses table

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
```

### notifications table

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
```

### push_devices table

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
```

---

## Notification Types & Triggers

### Automated Notifications

1. **APPOINTMENT_REMINDER**
   - Trigger: 48 hours, 24 hours, 2 hours before appointment
   - Channels: Push, Email, SMS (if enabled)

2. **ELIGIBILITY_REMINDER**
   - Trigger: When pet becomes eligible to donate again
   - Channels: Push, Email

3. **CONSENT_RENEWAL**
   - Trigger: 90 days, 30 days before consent expires
   - Channels: Push, Email

4. **VACCINATION_REMINDER**
   - Trigger: 30 days before vaccination due date
   - Channels: Push, Email

5. **THANK_YOU**
   - Trigger: After successful donation
   - Channels: Push, Email
   - Include: Impact statistics, next eligible date

6. **EMERGENCY_ALERT**
   - Trigger: Facility creates critical need alert
   - Channels: Push, SMS (if critical), Email
   - Matching: Based on blood type, species, location, eligibility

---

## Push Notification Integration

### Expo Push Notifications

**Send Push Notification:**
```javascript
const message = {
  to: 'ExponentPushToken[xxx]',
  sound: 'default',
  title: 'Emergency Alert',
  body: 'Critical need for DOG DEA 1.1 negative blood',
  data: {
    alertId: 'uuid',
    type: 'EMERGENCY',
    actionUrl: '/alerts/uuid'
  },
  priority: 'high',
  badge: 1
};
```

**Priority Levels:**
- CRITICAL alerts: `high` priority with sound
- Other alerts: `normal` priority

---

## Business Logic Notes

1. **Alert Matching Algorithm:**
   - Match user's pets by species and blood type
   - Check pet eligibility status
   - Check if pet can donate (not too soon after last donation)
   - Calculate distance from user to facility
   - Filter by user's radius preference

2. **Notification Batching:**
   - Group non-urgent notifications
   - Send digest emails (daily/weekly based on preference)
   - Respect quiet hours for non-critical alerts

3. **Rate Limiting:**
   - Max 5 emergency alerts per day per user
   - Max 10 general notifications per day

4. **Alert Expiration:**
   - Auto-expire alerts after specified time
   - Send "no longer needed" notification to responders
   - Update status to EXPIRED
