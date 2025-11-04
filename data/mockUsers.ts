import { User, RelationshipType, AccountStatus, RegistrationStatus } from '../types';

export const mockUsers: User[] = [
  {
    userId: 'user-001',
    fullName: 'Sarah Johnson',
    relationship: RelationshipType.OWNER,
    contactInfo: {
      address: {
        street: '123 Oak Street',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102',
        country: 'USA',
      },
      phones: {
        home: '+1-415-555-0101',
        mobile: '+1-415-555-0102',
      },
      email: 'sarah.johnson@email.com',
    },
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Spouse',
      phone: '+1-415-555-0103',
    },
    preferences: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
      emergencyAlerts: true,
      appointmentReminders: true,
      generalUpdates: true,
      radius: 25,
    },
    accountStatus: AccountStatus.ACTIVE,
    registrationStatus: RegistrationStatus.APPROVED,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-10-01T14:30:00Z',
  },
  {
    userId: 'user-002',
    fullName: 'David Martinez',
    relationship: RelationshipType.OWNER,
    contactInfo: {
      address: {
        street: '456 Maple Avenue',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
      },
      phones: {
        mobile: '+1-213-555-0201',
      },
      email: 'david.martinez@email.com',
    },
    emergencyContact: {
      name: 'Maria Martinez',
      relationship: 'Sister',
      phone: '+1-213-555-0202',
    },
    preferences: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      emergencyAlerts: true,
      appointmentReminders: true,
      generalUpdates: false,
      radius: 50,
    },
    accountStatus: AccountStatus.ACTIVE,
    registrationStatus: RegistrationStatus.APPROVED,
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2025-10-15T09:00:00Z',
  },
  {
    userId: 'user-003',
    fullName: 'Emily Chen',
    relationship: RelationshipType.OWNER,
    contactInfo: {
      address: {
        street: '789 Pine Road',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'USA',
      },
      phones: {
        home: '+1-206-555-0301',
        mobile: '+1-206-555-0302',
      },
      email: 'emily.chen@email.com',
    },
    emergencyContact: {
      name: 'James Chen',
      relationship: 'Father',
      phone: '+1-206-555-0303',
    },
    preferences: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
      emergencyAlerts: true,
      appointmentReminders: true,
      generalUpdates: true,
      radius: 10,
    },
    digitalSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    accountStatus: AccountStatus.ACTIVE,
    registrationStatus: RegistrationStatus.APPROVED,
    createdAt: '2024-02-10T12:00:00Z',
    updatedAt: '2025-11-01T16:00:00Z',
  },
  {
    userId: 'user-004',
    fullName: 'Robert Thompson',
    relationship: RelationshipType.AUTHORIZED_AGENT,
    contactInfo: {
      address: {
        street: '321 Elm Street',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'USA',
      },
      phones: {
        mobile: '+1-512-555-0401',
      },
      email: 'robert.thompson@email.com',
    },
    emergencyContact: {
      name: 'Linda Thompson',
      relationship: 'Wife',
      phone: '+1-512-555-0402',
    },
    preferences: {
      pushEnabled: true,
      emailEnabled: false,
      smsEnabled: true,
      emergencyAlerts: true,
      appointmentReminders: true,
      generalUpdates: false,
      radius: 25,
    },
    accountStatus: AccountStatus.ACTIVE,
    registrationStatus: RegistrationStatus.APPROVED,
    createdAt: '2024-05-01T14:00:00Z',
    updatedAt: '2025-10-20T11:00:00Z',
  },
  {
    userId: 'user-005',
    fullName: 'Jennifer Williams',
    relationship: RelationshipType.OWNER,
    contactInfo: {
      address: {
        street: '654 Birch Lane',
        city: 'Portland',
        state: 'OR',
        postalCode: '97201',
        country: 'USA',
      },
      phones: {
        home: '+1-503-555-0501',
        mobile: '+1-503-555-0502',
      },
      email: 'jennifer.williams@email.com',
    },
    emergencyContact: {
      name: 'Tom Williams',
      relationship: 'Brother',
      phone: '+1-503-555-0503',
    },
    preferences: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
      emergencyAlerts: true,
      appointmentReminders: true,
      generalUpdates: true,
      radius: 15,
    },
    digitalSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    accountStatus: AccountStatus.ACTIVE,
    registrationStatus: RegistrationStatus.APPROVED,
    createdAt: '2024-04-12T09:30:00Z',
    updatedAt: '2025-10-28T13:45:00Z',
  },
];

export const getCurrentUser = (): User => mockUsers[0];

export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.userId === userId);
};
