# Backend API - Authentication & User Management

## Base URL
`/v1/auth` and `/v1/users`

---

## Authentication Endpoints

### 1. Register User

**POST** `/v1/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "relationship": "OWNER",
  "contactInfo": {
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94102",
      "country": "USA"
    },
    "phones": {
      "mobile": "+1-555-0123",
      "home": "+1-555-0124"
    },
    "email": "john.doe@example.com"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1-555-0125"
  },
  "preferences": {
    "pushEnabled": true,
    "emailEnabled": true,
    "smsEnabled": false,
    "emergencyAlerts": true,
    "appointmentReminders": true,
    "generalUpdates": true,
    "radius": 25
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "relationship": "OWNER",
    "accountStatus": "ACTIVE",
    "registrationStatus": "PENDING",
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here",
    "expiresIn": 900
  },
  "message": "Registration successful"
}
```

**Validation Rules:**
- `fullName`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 8 chars, must include uppercase, lowercase, number, special char
- `relationship`: Required, enum: `OWNER` | `AUTHORIZED_AGENT`
- `contactInfo.phones.mobile`: Required, valid phone format

---

### 2. Login

**POST** `/v1/auth/login`

Authenticates user and returns JWT tokens.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here",
    "expiresIn": 900
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account suspended

---

### 3. Refresh Token

**POST** `/v1/auth/refresh`

Generates new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token",
    "expiresIn": 900
  }
}
```

---

### 4. Logout

**POST** `/v1/auth/logout`

**Headers:** `Authorization: Bearer <token>`

Invalidates current refresh token.

**Response:** `204 No Content`

---

### 5. Forgot Password

**POST** `/v1/auth/forgot-password`

Sends password reset email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 6. Reset Password

**POST** `/v1/auth/reset-password`

Resets password using token from email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Response:** `200 OK`

---

## User Profile Endpoints

### 7. Get Current User Profile

**GET** `/v1/users/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "fullName": "John Doe",
    "relationship": "OWNER",
    "contactInfo": {
      "address": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94102",
        "country": "USA"
      },
      "phones": {
        "mobile": "+1-555-0123",
        "home": "+1-555-0124"
      },
      "email": "john.doe@example.com"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+1-555-0125"
    },
    "preferences": {
      "pushEnabled": true,
      "emailEnabled": true,
      "smsEnabled": false,
      "emergencyAlerts": true,
      "appointmentReminders": true,
      "generalUpdates": true,
      "radius": 25
    },
    "digitalSignature": "base64-encoded-signature",
    "accountStatus": "ACTIVE",
    "registrationStatus": "APPROVED",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-11-04T12:00:00Z"
  }
}
```

---

### 8. Update User Profile

**PATCH** `/v1/users/me`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (partial update)
```json
{
  "fullName": "John Michael Doe",
  "contactInfo": {
    "phones": {
      "mobile": "+1-555-9999"
    }
  },
  "emergencyContact": {
    "name": "Jane M. Doe",
    "phone": "+1-555-8888"
  }
}
```

**Response:** `200 OK` (returns updated user object)

---

### 9. Update Notification Preferences

**PATCH** `/v1/users/me/preferences`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "pushEnabled": false,
  "emailEnabled": true,
  "smsEnabled": true,
  "emergencyAlerts": true,
  "appointmentReminders": true,
  "generalUpdates": false,
  "radius": 50
}
```

**Response:** `200 OK`

---

### 10. Upload Digital Signature

**POST** `/v1/users/me/signature`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**
```
signature: <file> (image/png, image/jpeg)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "signatureUrl": "https://cdn.donor-app.com/signatures/uuid.png",
    "signatureDataUrl": "data:image/png;base64,..."
  }
}
```

---

### 11. Delete Account

**DELETE** `/v1/users/me`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "password": "current-password",
  "confirmation": "DELETE"
}
```

**Response:** `204 No Content`

**Note:** This will soft-delete the account and anonymize data per GDPR requirements.

---

## TypeScript Types Reference

See `/types/user.types.ts` for complete type definitions:

```typescript
enum RelationshipType {
  OWNER = 'OWNER',
  AUTHORIZED_AGENT = 'AUTHORIZED_AGENT',
}

enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INCOMPLETE = 'INCOMPLETE',
}

interface User {
  userId: string;
  fullName: string;
  relationship: RelationshipType;
  contactInfo: ContactInfo;
  emergencyContact: EmergencyContact;
  preferences: NotificationPreferences;
  digitalSignature?: string;
  accountStatus: AccountStatus;
  registrationStatus: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

## Database Schema

### users table

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  relationship VARCHAR(20) NOT NULL CHECK (relationship IN ('OWNER', 'AUTHORIZED_AGENT')),
  
  -- Contact Info (JSONB for nested structure)
  contact_info JSONB NOT NULL,
  emergency_contact JSONB NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}',
  
  digital_signature TEXT,
  account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  registration_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_status ON users(account_status);
```

### refresh_tokens table

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
```

---

## Security Notes

1. **Password Storage:** Use bcrypt with cost factor 12+
2. **JWT Secret:** Use strong random secret (256-bit minimum)
3. **Token Expiry:** Access token 15 min, Refresh token 7 days
4. **Rate Limiting:** 5 login attempts per 15 minutes per email
5. **Email Verification:** Consider adding email verification flow
6. **2FA:** Consider adding two-factor authentication for future
7. **Session Management:** Store refresh tokens in database for revocation
8. **HTTPS Only:** All authentication endpoints must use HTTPS
