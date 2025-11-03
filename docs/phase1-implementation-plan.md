# Phase 1 Implementation Plan - Donor App POC

## Project Overview
**Framework**: Expo SDK 54 (Latest)  
**Navigation**: Expo Router (File-based routing)  
**Language**: TypeScript  
**Target**: iOS & Android  
**Backend**: Mock data (Static JSON)

---

## Folder Structure

```
donor-app-poc/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/                   # Auth group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Home/Dashboard
│   │   ├── pets.tsx              # My Pets
│   │   ├── appointments.tsx      # Appointments
│   │   ├── history.tsx           # Donation History
│   │   ├── profile.tsx           # User Profile
│   │   └── _layout.tsx
│   ├── pet/                      # Pet management
│   │   ├── [id].tsx              # Pet detail
│   │   ├── add.tsx               # Add new pet
│   │   ├── edit/[id].tsx         # Edit pet
│   │   └── eligibility/[id].tsx  # Eligibility questionnaire
│   ├── appointment/
│   │   ├── book.tsx              # Book appointment
│   │   ├── [id].tsx              # Appointment detail
│   │   └── facilities.tsx        # Facility list
│   ├── consent/
│   │   ├── [petId].tsx           # Consent form
│   │   └── review/[consentId].tsx # Review signed consent
│   ├── education/
│   │   ├── index.tsx             # Education hub
│   │   └── [articleId].tsx       # Article detail
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   ├── forms/                    # Form components
│   ├── pet/                      # Pet-specific components
│   ├── appointment/              # Appointment components
│   ├── donation/                 # Donation components
│   └── consent/                  # Consent components
├── constants/                    # App constants
├── types/                        # TypeScript type definitions
├── data/                         # Mock data
├── services/                     # Business logic & API simulation
├── hooks/                        # Custom React hooks
├── utils/                        # Utility functions
├── context/                      # React Context providers
└── assets/                       # Static assets
```

---

## Type Definitions Summary

### Core Types to Create:

1. **`types/user.types.ts`** - User, ContactInfo, Address, EmergencyContact, NotificationPreferences
2. **`types/pet.types.ts`** - Pet, Species, Sex, EligibilityStatus, BloodType, WeightRecord, VeterinarianInfo
3. **`types/eligibility.types.ts`** - EligibilityRecord, QuestionnaireResponse (Base, Dog, Cat, Horse), DisqualifyingFactor
4. **`types/consent.types.ts`** - ConsentRecord, ConsentData, ConsentStatus
5. **`types/appointment.types.ts`** - Appointment, AppointmentType, AppointmentStatus
6. **`types/donation.types.ts`** - DonationRecord, PreExamResults, CollectionDetails, LabScreeningResults
7. **`types/facility.types.ts`** - Facility, OperatingHours, FacilityCapabilities, VerificationStatus
8. **`types/alert.types.ts`** - Alert, AlertType, UrgencyLevel, AlertStatus

---

## Implementation Tasks by Sprint

### **Sprint 1: Project Setup & Foundation (Week 1)**

#### ✅ Task 1.1: Initialize Expo Project
- [ ] Create new Expo 54 project: `npx create-expo-app@latest donor-app-poc --template`
- [ ] Configure `app.json` with app name, bundle identifier
- [ ] Set up Expo Router file-based navigation
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up ESLint and Prettier
- [ ] Create complete folder structure
- [ ] Initialize Git repository

**Key Dependencies:**
```bash
npx create-expo-app@latest donor-app-poc
cd donor-app-poc
npx expo install expo-router react-native-safe-area-context react-native-screens
npx expo install expo-font expo-splash-screen expo-status-bar
```

#### ✅ Task 1.2: Create All Type Definitions
- [ ] Create all 8 type definition files in `types/` folder
- [ ] Define enums: Species, Sex, EligibilityStatus, BloodType, AppointmentType, etc.
- [ ] Define interfaces for all entities
- [ ] Create `types/index.ts` barrel export
- [ ] Ensure strict TypeScript configuration

#### ✅ Task 1.3: Setup Constants & Configuration
- [ ] Create `constants/Colors.ts` - Define color palette (primary, secondary, success, warning, error)
- [ ] Create `constants/Sizes.ts` - Spacing scale, font sizes, border radius
- [ ] Create `constants/Species.ts` - Species-specific data (icons, colors, eligibility criteria)
- [ ] Create `constants/AppConfig.ts` - App version, API endpoints (mock), feature flags

---

### **Sprint 2: Mock Data & Services (Week 1-2)**

#### ✅ Task 2.1: Create Mock Data Files
- [ ] `data/mockUsers.ts` - 5 sample users with complete profiles
- [ ] `data/mockPets.ts` - 15 pets (8 dogs, 5 cats, 2 horses) with varied eligibility
- [ ] `data/mockFacilities.ts` - 10 facilities across different locations
- [ ] `data/mockAppointments.ts` - Past, current, and upcoming appointments
- [ ] `data/mockDonations.ts` - 20+ donation records with complete details
- [ ] `data/mockEducation.ts` - 10 educational articles
- [ ] `data/index.ts` - Export all mock data

#### ✅ Task 2.2: Build Service Layer
- [ ] `services/storage.service.ts` - AsyncStorage wrapper with TypeScript
- [ ] `services/auth.service.ts` - Login, register, logout (mock)
- [ ] `services/pet.service.ts` - CRUD operations for pets
- [ ] `services/eligibility.service.ts` - Questionnaire submission, status calculation
- [ ] `services/consent.service.ts` - Consent creation, retrieval, PDF generation
- [ ] `services/appointment.service.ts` - Booking, cancellation, reminders
- [ ] `services/donation.service.ts` - History retrieval, stats calculation
- [ ] `services/notification.service.ts` - Local notification scheduling

**Install:**
```bash
npx expo install @react-native-async-storage/async-storage
npx expo install expo-notifications
```

#### ✅ Task 2.3: Create Custom Hooks
- [ ] `hooks/useAuth.ts` - Authentication state, login/logout functions
- [ ] `hooks/usePets.ts` - Pet list, add/edit/delete operations
- [ ] `hooks/useAppointments.ts` - Appointment management
- [ ] `hooks/useDonations.ts` - Donation history and stats
- [ ] `hooks/useNotifications.ts` - Notification permissions and handling
- [ ] `hooks/useLocation.ts` - Geolocation and distance calculations

**Install:**
```bash
npx expo install expo-location
```

#### ✅ Task 2.4: Setup Context Providers
- [ ] `context/AuthContext.tsx` - User state, authentication methods
- [ ] `context/PetContext.tsx` - Pet management state
- [ ] `context/AppContext.tsx` - Global app state (loading, errors)
- [ ] Update `app/_layout.tsx` to wrap with providers

---

### **Sprint 3: UI Components Library (Week 2)**

#### ✅ Task 3.1: Base UI Components
- [ ] `components/ui/Button.tsx` - Primary, secondary, outline, disabled states
- [ ] `components/ui/Input.tsx` - Text input with validation, error states
- [ ] `components/ui/Card.tsx` - Container with shadow and padding
- [ ] `components/ui/Badge.tsx` - Status badges with colors
- [ ] `components/ui/Modal.tsx` - Bottom sheet and full-screen modals
- [ ] `components/ui/Loading.tsx` - Spinner and skeleton loaders
- [ ] `components/ui/EmptyState.tsx` - Empty list placeholders

**Install:**
```bash
npx expo install react-native-reanimated react-native-gesture-handler
```

#### ✅ Task 3.2: Form Components
- [ ] `components/forms/FormField.tsx` - Wrapper with label, error message
- [ ] `components/forms/FormSelect.tsx` - Dropdown picker
- [ ] `components/forms/FormDatePicker.tsx` - Date selection
- [ ] `components/forms/FormImagePicker.tsx` - Photo upload with preview
- [ ] `components/forms/FormCheckbox.tsx` - Checkbox with label

**Install:**
```bash
npx expo install expo-image-picker @react-native-community/datetimepicker
```

#### ✅ Task 3.3: Domain-Specific Components
- [ ] `components/pet/PetCard.tsx` - Pet list item with photo, name, status
- [ ] `components/pet/PetAvatar.tsx` - Circular avatar with species icon
- [ ] `components/pet/EligibilityBadge.tsx` - Color-coded status badge
- [ ] `components/appointment/AppointmentCard.tsx` - Appointment summary card
- [ ] `components/appointment/FacilityCard.tsx` - Facility info with map
- [ ] `components/donation/DonationCard.tsx` - Donation record card
- [ ] `components/donation/DonationStats.tsx` - Stats dashboard
- [ ] `components/consent/SignaturePad.tsx` - Digital signature capture

**Install:**
```bash
npx expo install react-native-maps react-native-signature-canvas
```

---

### **Sprint 4: Authentication & User Profile (Week 3)**

#### ✅ Task 4.1: Authentication Screens
- [ ] `app/(auth)/login.tsx` - Email/password login with validation
- [ ] `app/(auth)/register.tsx` - Multi-step registration form
- [ ] `app/(auth)/_layout.tsx` - Auth stack navigation
- [ ] Implement form validation with error messages
- [ ] Add loading states during authentication
- [ ] Handle authentication errors gracefully

#### ✅ Task 4.2: User Profile
- [ ] `app/(tabs)/profile.tsx` - Display user information
- [ ] Add edit profile modal/screen
- [ ] Emergency contact management
- [ ] Notification preferences toggle
- [ ] Digital signature capture and display
- [ ] Profile photo upload

#### ✅ Task 4.3: Onboarding
- [ ] Create welcome screen with app benefits
- [ ] Request permissions (notifications, location, camera)
- [ ] Quick tour of main features
- [ ] Store onboarding completion flag

---

### **Sprint 5: Pet Management (Week 3-4)**

#### ✅ Task 5.1: Pet List
- [ ] `app/(tabs)/pets.tsx` - Display all user's pets
- [ ] Show eligibility status for each pet
- [ ] Add floating action button for "Add Pet"
- [ ] Implement search and filter
- [ ] Empty state for no pets

#### ✅ Task 5.2: Add/Edit Pet Forms
- [ ] `app/pet/add.tsx` - Multi-step pet registration
  - Step 1: Basic info (name, species, breed, DOB, sex)
  - Step 2: Physical (weight, color, markings, photo)
  - Step 3: Veterinarian information
  - Step 4: Medical records upload
- [ ] `app/pet/edit/[id].tsx` - Edit existing pet
- [ ] Breed autocomplete/search
- [ ] Photo capture from camera or gallery
- [ ] Weight history tracking

**Install:**
```bash
npx expo install expo-camera expo-document-picker
```

#### ✅ Task 5.3: Pet Detail View
- [ ] `app/pet/[id].tsx` - Complete pet profile
- [ ] Display eligibility status prominently
- [ ] Show donation history summary
- [ ] Quick actions: Book appointment, View history, Edit
- [ ] Next eligible donation date countdown

---

### **Sprint 6: Eligibility Questionnaire (Week 4)**

#### ✅ Task 6.1: Questionnaire Screens
- [ ] `app/pet/eligibility/[id].tsx` - Species-specific questionnaire
- [ ] Base questions (all species)
- [ ] Dog-specific questions (age, weight, heartworm, etc.)
- [ ] Cat-specific questions (indoor-only, FeLV/FIV, etc.)
- [ ] Horse-specific questions (Coggins, transport, etc.)
- [ ] Progress indicator
- [ ] Form validation

#### ✅ Task 6.2: Eligibility Logic
- [ ] `utils/eligibility.ts` - Eligibility calculation rules
- [ ] Auto-disqualification checks (age, weight, health)
- [ ] Generate disqualifying factors list
- [ ] Calculate next review date
- [ ] Save eligibility record

#### ✅ Task 6.3: Results Screen
- [ ] Display eligibility status with icon
- [ ] Show disqualifying factors if ineligible
- [ ] Provide guidance for next steps
- [ ] Option to retake questionnaire
- [ ] Navigate to consent if eligible

---

### **Sprint 7: Digital Consent System (Week 5)**

#### ✅ Task 7.1: Consent Form
- [ ] `app/consent/[petId].tsx` - Digital consent form
- [ ] Owner certification section
- [ ] Authorization for procedures
- [ ] Risk acknowledgment with checkboxes
- [ ] Program commitment
- [ ] Optional publicity consent
- [ ] Form validation (all required checked)

#### ✅ Task 7.2: Digital Signature
- [ ] Signature pad component
- [ ] Clear and redo functionality
- [ ] Save signature as base64 image
- [ ] Timestamp and IP logging
- [ ] Generate consent record

#### ✅ Task 7.3: Consent Review
- [ ] `app/consent/review/[consentId].tsx` - View signed consent
- [ ] PDF-like formatted view
- [ ] Display signature and date
- [ ] Email copy option
- [ ] Expiration date display

---

### **Sprint 8: Appointment Booking (Week 5-6)**

#### ✅ Task 8.1: Facility Directory
- [ ] `app/appointment/facilities.tsx` - List all facilities
- [ ] Filter by species accepted
- [ ] Sort by distance
- [ ] Map view with facility markers
- [ ] Facility detail cards

**Install:**
```bash
npx expo install react-native-maps
```

#### ✅ Task 8.2: Booking Flow
- [ ] `app/appointment/book.tsx` - Appointment booking
- [ ] Select pet (eligible pets only)
- [ ] Select facility
- [ ] Choose date and time slot
- [ ] Select appointment type
- [ ] Pre-appointment checklist
- [ ] Confirmation screen

#### ✅ Task 8.3: Appointment Management
- [ ] `app/(tabs)/appointments.tsx` - List upcoming appointments
- [ ] `app/appointment/[id].tsx` - Appointment details
- [ ] Cancel appointment with reason
- [ ] Reschedule appointment
- [ ] Add to device calendar
- [ ] Directions to facility

**Install:**
```bash
npx expo install expo-calendar
```

---

### **Sprint 9: Donation History & Tracking (Week 6)**

#### ✅ Task 9.1: Donation History
- [ ] `app/(tabs)/history.tsx` - List all donations
- [ ] Filter by pet
- [ ] Sort by date
- [ ] Donation cards with key details
- [ ] Empty state for no donations

#### ✅ Task 9.2: Donation Details
- [ ] Detailed donation record view
- [ ] Pre-exam results
- [ ] Collection details
- [ ] Lab results (if available)
- [ ] Post-donation notes
- [ ] Export as PDF

#### ✅ Task 9.3: Dashboard & Stats
- [ ] `app/(tabs)/index.tsx` - Home dashboard
- [ ] Total donations count
- [ ] Lives saved estimate
- [ ] Next eligible donation date
- [ ] Upcoming appointments
- [ ] Recent activity
- [ ] Achievement badges

---

### **Sprint 10: Notifications & Education (Week 7)**

#### ✅ Task 10.1: Notification System
- [ ] Request notification permissions
- [ ] Schedule appointment reminders (48hr, 24hr, 2hr)
- [ ] Eligibility reminder notifications
- [ ] Consent renewal reminders
- [ ] Thank you notifications post-donation
- [ ] In-app notification center

#### ✅ Task 10.2: Educational Content
- [ ] `app/education/index.tsx` - Education hub
- [ ] `app/education/[articleId].tsx` - Article detail
- [ ] Categories: Why Donate, The Process, FAQs, Success Stories
- [ ] Rich text rendering
- [ ] Video embeds (if applicable)
- [ ] Bookmark functionality

---

### **Sprint 11: Polish & Testing (Week 7-8)**

#### ✅ Task 11.1: UI/UX Polish
- [ ] Consistent spacing and typography
- [ ] Smooth transitions and animations
- [ ] Loading states for all async operations
- [ ] Error handling with user-friendly messages
- [ ] Accessibility: Screen reader support, color contrast
- [ ] Dark mode support (optional)

#### ✅ Task 11.2: Testing
- [ ] Test all user flows end-to-end
- [ ] Test on iOS and Android devices
- [ ] Test with different screen sizes
- [ ] Test offline functionality
- [ ] Test edge cases (no pets, no appointments, etc.)
- [ ] Fix bugs and issues

#### ✅ Task 11.3: Documentation
- [ ] Update README with setup instructions
- [ ] Document mock data structure
- [ ] Document component usage
- [ ] Create developer guide
- [ ] Prepare handoff documentation for backend team

---

## Key Features Summary

### Phase 1 Must-Have Features:
1. ✅ User registration & authentication
2. ✅ Complete pet profile with photos
3. ✅ Species-specific eligibility questionnaire
4. ✅ Digital consent form with signature
5. ✅ Appointment booking system
6. ✅ Donation history tracking
7. ✅ Facility directory with map
8. ✅ Pre/post-donation instructions
9. ✅ Email & push notifications
10. ✅ Educational content library

---

## Technical Stack

### Core Technologies:
- **Expo SDK**: 54.x (Latest)
- **React Native**: 0.76.x
- **TypeScript**: 5.3+
- **Expo Router**: 4.x (File-based routing)

### Key Expo Modules:
- `expo-router` - Navigation
- `expo-image-picker` - Photo uploads
- `expo-camera` - Camera access
- `expo-location` - Geolocation
- `expo-notifications` - Push notifications
- `expo-document-picker` - File uploads
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-maps` - Map integration
- `react-native-signature-canvas` - Digital signatures
- `@react-native-community/datetimepicker` - Date/time selection

### UI Libraries (Optional):
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Gestures
- `react-native-calendars` - Calendar views

---

## Success Criteria

### Phase 1 Completion Checklist:
- [ ] All 10 must-have features implemented
- [ ] All screens responsive and intuitive
- [ ] Type-safe codebase (no TypeScript errors)
- [ ] Mock data covers all scenarios
- [ ] Smooth navigation between screens
- [ ] Proper error handling throughout
- [ ] Loading states for async operations
- [ ] Works on iOS and Android
- [ ] Documentation complete
- [ ] Ready for backend integration

---

## Next Steps After Phase 1

1. **Backend Integration**: Replace mock services with real API calls
2. **Real-time Alerts**: Implement emergency blood need notifications
3. **Rewards System**: Add gamification and badges
4. **Community Features**: Social sharing and donor community
5. **Admin Portal**: Build web portal for clinics
6. **Advanced Analytics**: Track user engagement and donation metrics

---

## Notes for Backend Developer

### API Endpoints Needed:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `GET /pets` - Get user's pets
- `POST /pets` - Create pet
- `PUT /pets/:id` - Update pet
- `DELETE /pets/:id` - Delete pet
- `POST /pets/:id/eligibility` - Submit eligibility questionnaire
- `POST /pets/:id/consent` - Submit consent form
- `GET /facilities` - Get facility list
- `GET /facilities/:id` - Get facility details
- `POST /appointments` - Book appointment
- `GET /appointments` - Get user's appointments
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment
- `GET /donations` - Get donation history
- `GET /donations/:id` - Get donation details
- `GET /education` - Get educational articles

### Data Models:
All TypeScript interfaces in `types/` folder serve as the contract for API request/response structures. Backend should implement these exact schemas for seamless integration.

---

**End of Phase 1 Implementation Plan**
