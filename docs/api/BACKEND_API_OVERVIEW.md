# Backend API Specification - Overview

## Project: Donor App (Pet Blood Donation Platform)

**Version:** 1.0.0  
**Base URL:** `https://api.donor-app.com/v1`  
**Protocol:** REST API with JSON  
**Authentication:** JWT Bearer Token

---

## Table of Contents

1. [BACKEND_API_AUTH.md](./BACKEND_API_AUTH.md) - Authentication & User Management
2. [BACKEND_API_PETS.md](./BACKEND_API_PETS.md) - Pet Profile Management
3. [BACKEND_API_ELIGIBILITY.md](./BACKEND_API_ELIGIBILITY.md) - Eligibility & Health Screening
4. [BACKEND_API_CONSENT.md](./BACKEND_API_CONSENT.md) - Digital Consent System
5. [BACKEND_API_APPOINTMENTS.md](./BACKEND_API_APPOINTMENTS.md) - Appointment Booking
6. [BACKEND_API_DONATIONS.md](./BACKEND_API_DONATIONS.md) - Donation Records & History
7. [BACKEND_API_FACILITIES.md](./BACKEND_API_FACILITIES.md) - Facility Directory
8. [BACKEND_API_ALERTS.md](./BACKEND_API_ALERTS.md) - Notifications & Alerts
9. [BACKEND_DATABASE_SCHEMA.md](./BACKEND_DATABASE_SCHEMA.md) - Complete Database Schema

---

## Technology Stack Requirements

### Backend Framework
- **Recommended:** Node.js with Express.js or NestJS
- **Alternative:** Python (FastAPI/Django), Ruby on Rails, or Go

### Database
- **Primary:** PostgreSQL 14+ (for relational data)
- **Alternative:** MongoDB (if document-based approach preferred)
- **Caching:** Redis for session management and caching

### Storage
- **File Storage:** AWS S3 or Google Cloud Storage (for images, PDFs, documents)
- **CDN:** CloudFront or similar for media delivery

### Real-time Communication
- **WebSockets:** Socket.io or native WebSocket for emergency alerts
- **Alternative:** Server-Sent Events (SSE)

### Message Queue
- **Recommended:** RabbitMQ or AWS SQS for notification processing
- **Purpose:** Async email/SMS/push notification delivery

---

## Authentication & Security

### Authentication Method
- **JWT (JSON Web Tokens)** for stateless authentication
- **Token Expiry:** Access token (15 min), Refresh token (7 days)
- **Storage:** Secure HTTP-only cookies or AsyncStorage (mobile)

### Security Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-API-Key: <optional_api_key>
```

### Security Requirements
- HTTPS/TLS 1.3 only
- Password hashing: bcrypt (cost factor 12+)
- Rate limiting: 100 requests/minute per user
- CORS configuration for mobile app origins
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2025-11-04T12:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* additional error context */ }
  },
  "timestamp": "2025-11-04T12:30:00Z"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Standard HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource or state conflict |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Temporary downtime |

---

## Common Error Codes

```typescript
enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resources
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  
  // Business Logic
  PET_NOT_ELIGIBLE = 'PET_NOT_ELIGIBLE',
  CONSENT_EXPIRED = 'CONSENT_EXPIRED',
  APPOINTMENT_CONFLICT = 'APPOINTMENT_CONFLICT',
  DONATION_TOO_SOON = 'DONATION_TOO_SOON',
  
  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

---

## API Versioning

- **Current Version:** v1
- **URL Pattern:** `/v1/endpoint`
- **Version Header:** `Accept: application/vnd.donor-app.v1+json` (optional)
- **Deprecation Notice:** 6 months before version sunset

---

## Rate Limiting

| Endpoint Type | Rate Limit | Window |
|---------------|------------|--------|
| Authentication | 5 requests | 15 minutes |
| Read Operations | 100 requests | 1 minute |
| Write Operations | 30 requests | 1 minute |
| File Uploads | 10 requests | 1 minute |
| Emergency Alerts | No limit | - |

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699104000
```

---

## File Upload Specifications

### Image Uploads (Pet Photos, Signatures)
- **Max Size:** 10 MB
- **Formats:** JPEG, PNG, WebP
- **Recommended:** 1024x1024px max
- **Compression:** Server-side optimization required

### Document Uploads (Vaccination Records, Test Results)
- **Max Size:** 25 MB
- **Formats:** PDF, JPEG, PNG
- **Virus Scanning:** Required before storage

### Upload Endpoint Pattern
```
POST /v1/upload
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "data": {
    "fileId": "uuid",
    "url": "https://cdn.donor-app.com/files/...",
    "thumbnailUrl": "https://cdn.donor-app.com/thumbnails/...",
    "size": 1024000,
    "mimeType": "image/jpeg"
  }
}
```

---

## Webhook Support (Future)

For facility/admin integrations:
- Appointment confirmations
- Donation completions
- Eligibility status changes
- Emergency alert broadcasts

---

## API Documentation Tools

**Recommended:** OpenAPI/Swagger specification for interactive documentation

**Generate from:** TypeScript types provided in `/types` directory

---

## Environment Configuration

```env
# Server
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/donor_app
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=<secure_random_string>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS/Storage
AWS_REGION=us-east-1
AWS_S3_BUCKET=donor-app-files
AWS_CLOUDFRONT_URL=https://cdn.donor-app.com

# Email
SENDGRID_API_KEY=<key>
EMAIL_FROM=noreply@donor-app.com

# SMS
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_PHONE_NUMBER=<number>

# Push Notifications
FCM_SERVER_KEY=<firebase_key>
APNS_KEY_ID=<apple_key>
```

---

## Next Steps

1. Review individual API endpoint documentation files
2. Implement database schema (see BACKEND_DATABASE_SCHEMA.md)
3. Set up authentication middleware
4. Implement core CRUD operations
5. Add business logic validation
6. Set up file storage and CDN
7. Implement notification services
8. Add monitoring and logging (Sentry, DataDog, etc.)
9. Write API tests (unit + integration)
10. Deploy to staging environment

---

## Support & Questions

For questions about the API specification or TypeScript type definitions, refer to:
- `/types` directory for complete type definitions
- `/docs/requirements.md` for business requirements
- `/docs/PROGRESS.md` for implementation status
