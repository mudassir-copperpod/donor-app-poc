import { User } from '../types';
import { mockUsers, getCurrentUser } from '../data';
import { storageService } from './storage.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

/**
 * Authentication Service - Mock implementation for Phase 1
 * In Phase 2, this will be replaced with real API calls
 */
class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await this.delay(800);

      // Mock validation - accept any email/password for demo
      const user = mockUsers.find(u => u.contactInfo.email === credentials.email);
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Generate mock token
      const token = this.generateMockToken();

      // Save to storage
      await storageService.saveUser(user);
      await storageService.saveAuthToken(token);

      return {
        success: true,
        user,
        token,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await this.delay(1000);

      // Check if email already exists
      const existingUser = mockUsers.find(u => u.contactInfo.email === data.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Email already registered',
        };
      }

      // Create new user (mock)
      const newUser: User = {
        userId: `user-${Date.now()}`,
        fullName: data.fullName,
        relationship: 'OWNER' as any,
        contactInfo: {
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'USA',
          },
          phones: {
            mobile: data.phone,
          },
          email: data.email,
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
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
        accountStatus: 'ACTIVE' as any,
        registrationStatus: 'APPROVED' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Generate mock token
      const token = this.generateMockToken();

      // Save to storage
      await storageService.saveUser(newUser);
      await storageService.saveAuthToken(token);

      return {
        success: true,
        user: newUser,
        token,
        message: 'Registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration',
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await storageService.removeUser();
      await storageService.removeAuthToken();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      return await storageService.getUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await storageService.getAuthToken();
      return token !== null;
    } catch (error) {
      console.error('Is authenticated error:', error);
      return false;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(user: User): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await this.delay(500);

      // Update storage
      await storageService.saveUser(user);

      return {
        success: true,
        user,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Failed to update profile',
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API delay
      await this.delay(800);

      const user = mockUsers.find(u => u.contactInfo.email === email);
      
      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message: 'If an account exists with this email, you will receive password reset instructions',
        };
      }

      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Failed to process password reset request',
      };
    }
  }

  /**
   * Auto-login for demo purposes
   */
  async autoLogin(): Promise<AuthResponse> {
    try {
      const user = getCurrentUser();
      const token = this.generateMockToken();

      await storageService.saveUser(user);
      await storageService.saveAuthToken(token);

      return {
        success: true,
        user,
        token,
        message: 'Auto-login successful',
      };
    } catch (error) {
      console.error('Auto-login error:', error);
      return {
        success: false,
        message: 'Auto-login failed',
      };
    }
  }

  // Helper methods

  private generateMockToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();
