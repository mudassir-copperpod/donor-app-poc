# Backend API Documentation

Complete backend API specification for the **Donor App** - Pet Blood Donation Platform.

---

## 📚 Documentation Index

### Core Documentation
1. **[BACKEND_API_OVERVIEW.md](./BACKEND_API_OVERVIEW.md)** - Start here
   - Technology stack requirements
   - Authentication & security
   - Standard response formats
   - Error codes & rate limiting
   - File upload specifications

### API Endpoints by Domain

2. **[BACKEND_API_AUTH.md](./BACKEND_API_AUTH.md)** - Authentication & User Management
   - Register, Login, Logout
   - Password reset
   - User profile management
   - Notification preferences
   - Digital signature upload

3. **[BACKEND_API_PETS.md](./BACKEND_API_PETS.md)** - Pet Profile Management
   - CRUD operations for pets
   - Photo uploads
   - Weight tracking
   - Donation history per pet
   - Eligibility status checks

4. **[BACKEND_API_ELIGIBILITY_CONSENT.md](./BACKEND_API_ELIGIBILITY_CONSENT.md)** - Health Screening & Consent
   - Species-specific eligibility questionnaires
   - Automatic eligibility calculation
   - Digital consent form creation
   - Consent renewal & revocation
   - PDF generation

5. **[BACKEND_API_APPOINTMENTS_DONATIONS.md](./BACKEND_API_APPOINTMENTS_DONATIONS.md)** - Appointments & Donations
   - Appointment booking & management
   - Facility directory & search
   - Donation record creation
   - Donation statistics & history
   - Geolocation-based facility search

6. **[BACKEND_API_ALERTS.md](./BACKEND_API_ALERTS.md)** - Alerts & Notifications
   - Emergency blood need alerts
   - Push notification management
   - Alert response tracking
   - Notification preferences
   - Device registration

### Database

7. **[BACKEND_DATABASE_SCHEMA.md](./BACKEND_DATABASE_SCHEMA.md)** - Complete Database Schema
   - PostgreSQL schema with all tables
   - Indexes & constraints
   - Triggers & functions
   - Useful views
   - Backup & maintenance scripts

---

## 🚀 Quick Start for Backend Developers

### 1. Review the Tech Stack
- **Framework:** Node.js (Express/NestJS), Python (FastAPI), or similar
- **Database:** PostgreSQL 14+ with PostGIS extension
- **Storage:** AWS S3 or Google Cloud Storage
- **Caching:** Redis
- **Real-time:** WebSockets for emergency alerts

### 2. Set Up Database
```bash
# Create database
createdb donor_app

# Run schema from BACKEND_DATABASE_SCHEMA.md
psql donor_app < schema.sql
```

### 3. Implement Authentication First
- JWT-based authentication (see BACKEND_API_AUTH.md)
- Bcrypt password hashing (cost factor 12+)
- Refresh token rotation
- Rate limiting on auth endpoints

### 4. Build Core Endpoints
Priority order:
1. Authentication & User Management
2. Pet Profile Management
3. Eligibility & Consent
4. Appointments & Facilities
5. Donations & History
6. Alerts & Notifications

### 5. Integrate External Services
- **Email:** SendGrid or AWS SES
- **SMS:** Twilio
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **File Storage:** AWS S3 with CloudFront CDN
- **Maps:** Google Maps API for geolocation

---

## 📊 API Endpoint Summary

### Authentication (6 endpoints)
- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login
- `POST /v1/auth/refresh` - Refresh access token
- `POST /v1/auth/logout` - Logout
- `POST /v1/auth/forgot-password` - Password reset request
- `POST /v1/auth/reset-password` - Reset password

### Users (4 endpoints)
- `GET /v1/users/me` - Get current user
- `PATCH /v1/users/me` - Update user profile
- `PATCH /v1/users/me/preferences` - Update preferences
- `DELETE /v1/users/me` - Delete account

### Pets (9 endpoints)
- `GET /v1/pets` - List all pets
- `POST /v1/pets` - Create pet profile
- `GET /v1/pets/:id` - Get pet details
- `PATCH /v1/pets/:id` - Update pet
- `DELETE /v1/pets/:id` - Delete pet
- `POST /v1/pets/:id/photo` - Upload photo
- `GET /v1/pets/:id/donations` - Pet donation history
- `GET /v1/pets/:id/appointments` - Pet appointments
- `GET /v1/pets/:id/eligibility` - Check eligibility

### Eligibility (4 endpoints)
- `POST /v1/eligibility/questionnaire` - Submit questionnaire
- `GET /v1/eligibility/:id` - Get eligibility record
- `GET /v1/pets/:petId/eligibility/latest` - Latest eligibility
- `PATCH /v1/eligibility/:id/status` - Update status (admin)

### Consent (6 endpoints)
- `POST /v1/consent` - Create consent
- `GET /v1/consent/:id` - Get consent record
- `GET /v1/pets/:petId/consent/active` - Active consent
- `GET /v1/pets/:petId/consents` - All consents
- `POST /v1/consent/:id/revoke` - Revoke consent
- `POST /v1/consent/:id/renew` - Renew consent

### Appointments (8 endpoints)
- `POST /v1/appointments` - Book appointment
- `GET /v1/appointments` - List appointments
- `GET /v1/appointments/:id` - Get appointment
- `PATCH /v1/appointments/:id` - Update appointment
- `POST /v1/appointments/:id/cancel` - Cancel appointment
- `POST /v1/appointments/:id/confirm` - Confirm (facility)
- `POST /v1/appointments/:id/checkin` - Check-in (facility)
- `POST /v1/appointments/:id/complete` - Complete (facility)

### Donations (6 endpoints)
- `POST /v1/donations` - Create donation record (facility)
- `GET /v1/donations/:id` - Get donation
- `GET /v1/pets/:petId/donations` - Pet donations
- `GET /v1/donations` - All user donations
- `GET /v1/donations/stats` - Donation statistics
- `PATCH /v1/donations/:id/usage` - Update usage (facility)

### Facilities (3 endpoints)
- `GET /v1/facilities` - List facilities (with filters)
- `GET /v1/facilities/:id` - Get facility details
- `GET /v1/facilities/:id/availability` - Check availability

### Alerts (5 endpoints)
- `GET /v1/alerts` - Get active alerts
- `GET /v1/alerts/:id` - Get alert details
- `POST /v1/alerts/:id/respond` - Respond to alert
- `POST /v1/alerts` - Create alert (facility)
- `PATCH /v1/alerts/:id/status` - Update status (facility)

### Notifications (7 endpoints)
- `GET /v1/notifications` - List notifications
- `PATCH /v1/notifications/:id/read` - Mark as read
- `POST /v1/notifications/read-all` - Mark all as read
- `DELETE /v1/notifications/:id` - Delete notification
- `GET /v1/notifications/preferences` - Get preferences
- `PATCH /v1/notifications/preferences` - Update preferences
- `POST /v1/notifications/devices` - Register device

**Total: 67 API endpoints**

---

## 🔐 Security Checklist

- [ ] HTTPS/TLS 1.3 only
- [ ] JWT authentication with short-lived tokens (15 min)
- [ ] Refresh token rotation
- [ ] Password hashing with bcrypt (cost 12+)
- [ ] Rate limiting on all endpoints
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection
- [ ] CORS configuration
- [ ] Secure file upload validation
- [ ] API key rotation strategy
- [ ] Audit logging for sensitive operations
- [ ] Data encryption at rest
- [ ] Regular security audits

---

## 📈 Performance Considerations

### Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling (min 10, max 50 connections)
- Query optimization with EXPLAIN ANALYZE
- Regular VACUUM and ANALYZE operations
- Read replicas for heavy read operations

### Caching Strategy
- Redis for session management
- Cache frequently accessed data (facilities, blood types)
- Cache TTL: 5 minutes for dynamic data, 1 hour for static
- Invalidate cache on data updates

### API Performance
- Response time target: < 200ms for 95th percentile
- Pagination for all list endpoints (default 20 items)
- Lazy loading for large datasets
- Compress responses (gzip)
- CDN for static assets

---

## 🧪 Testing Requirements

### Unit Tests
- All business logic functions
- Eligibility calculation algorithms
- Date/time calculations
- Validation functions

### Integration Tests
- All API endpoints
- Database transactions
- External service integrations
- Authentication flows

### Load Testing
- 1000 concurrent users
- 10,000 requests per minute
- Database connection pool limits
- Cache hit rates

---

## 📝 Implementation Notes

### Business Logic Highlights

1. **Eligibility Calculation**
   - Automatic disqualifying factor detection
   - Species-specific age/weight requirements
   - Temporary vs permanent ineligibility
   - Annual re-verification reminders

2. **Consent Management**
   - 12-month expiration period
   - Renewal reminders at 90 and 30 days
   - PDF generation for records
   - Email copy to owner

3. **Donation Scheduling**
   - 8-12 week intervals between donations
   - Species-specific volume limits
   - Automatic next eligible date calculation
   - Conflict detection

4. **Alert Matching**
   - Geolocation-based radius search
   - Blood type and species matching
   - Eligibility status verification
   - User preference filtering

---

## 🔄 Data Flow Examples

### New User Registration Flow
1. User submits registration → `POST /v1/auth/register`
2. Backend validates data, hashes password
3. Creates user record with PENDING status
4. Generates JWT tokens
5. Sends welcome email
6. Returns user data + tokens

### Donation Booking Flow
1. User searches facilities → `GET /v1/facilities?species=DOG&radius=25`
2. Checks availability → `GET /v1/facilities/:id/availability`
3. Books appointment → `POST /v1/appointments`
4. Backend validates:
   - Pet is ELIGIBLE
   - Active consent exists
   - No scheduling conflicts
5. Creates appointment record
6. Sends confirmation email + push notification
7. Schedules reminder notifications (48hr, 24hr, 2hr)

### Emergency Alert Flow
1. Facility creates alert → `POST /v1/alerts`
2. Backend queries matching donors:
   - Within radius
   - Matching blood type/species
   - Currently eligible
   - Active consent
3. Sends push notifications to matched users
4. Users respond → `POST /v1/alerts/:id/respond`
5. Facility contacts responders
6. Alert marked as FILLED → `PATCH /v1/alerts/:id/status`

---

## 📞 Support & Questions

For questions about:
- **API Specification:** Review individual endpoint documentation
- **Type Definitions:** See `/types` directory in the frontend repo
- **Business Requirements:** See `/docs/requirements.md`
- **Implementation Status:** See `/docs/PROGRESS.md`

---

## 🎯 Next Steps

1. **Set up development environment**
   - Install PostgreSQL 14+ with PostGIS
   - Set up Redis
   - Configure AWS S3 or equivalent

2. **Initialize database**
   - Run schema from BACKEND_DATABASE_SCHEMA.md
   - Create seed data for testing

3. **Implement authentication**
   - JWT token generation/validation
   - Password hashing
   - Refresh token rotation

4. **Build core endpoints**
   - Follow priority order above
   - Write tests for each endpoint

5. **Integrate external services**
   - Email (SendGrid/SES)
   - SMS (Twilio)
   - Push notifications (FCM)
   - File storage (S3)

6. **Deploy to staging**
   - Set up CI/CD pipeline
   - Configure monitoring (Sentry, DataDog)
   - Load testing

7. **Production deployment**
   - Security audit
   - Performance optimization
   - Documentation review

---

**Last Updated:** November 4, 2025  
**API Version:** 1.0.0  
**Status:** Ready for Implementation
