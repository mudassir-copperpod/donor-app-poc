export const AppConfig = {
  // App information
  appName: 'Donor App',
  appVersion: '1.0.0',
  appDescription: 'Pet Blood Donation Platform',
  
  // API Configuration (Mock for Phase 1)
  apiBaseUrl: 'https://api.donor-app.com/v1', // Not used in Phase 1
  apiTimeout: 30000, // 30 seconds
  
  // Feature flags
  features: {
    emergencyAlerts: true,
    socialSharing: false, // Phase 2
    communityFeatures: false, // Phase 3
    rewardsSystem: false, // Phase 2
    adminPortal: false, // Phase 3
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // Geolocation
  geolocation: {
    defaultRadius: 25, // miles
    maxRadius: 100,
    radiusOptions: [5, 10, 25, 50, 100],
  },
  
  // Donation intervals (in weeks)
  donationIntervals: {
    dog: 8,
    cat: 8,
    horse: 8,
  },
  
  // Consent form
  consentFormVersion: '1.0',
  consentValidityPeriod: 365, // days (1 year)
  
  // Appointment reminders (in hours before appointment)
  appointmentReminders: [48, 24, 2],
  
  // File upload limits
  fileUpload: {
    maxSizeInMB: 10,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/heic'],
    allowedDocumentTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  
  // Contact information
  support: {
    email: 'support@donor-app.com',
    phone: '+1-800-DONOR-APP',
    emergencyHotline: '+1-800-EMERGENCY',
  },
  
  // Social links
  social: {
    website: 'https://donor-app.com',
    facebook: 'https://facebook.com/donorapp',
    instagram: 'https://instagram.com/donorapp',
    twitter: 'https://twitter.com/donorapp',
  },
  
  // Legal
  legal: {
    termsOfServiceUrl: 'https://donor-app.com/terms',
    privacyPolicyUrl: 'https://donor-app.com/privacy',
    consentFormUrl: 'https://donor-app.com/consent',
  },
};

export type AppConfigKey = keyof typeof AppConfig;
