import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../types/user.types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check if user is authenticated
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const user = await authService.getCurrentUser();
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to check authentication status',
      });
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        setState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        
        return { success: true, user: response.user };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Login failed',
        }));
        
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (fullName: string, email: string, password: string, phone: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await authService.register({ fullName, email, password, phone });
      
      if (response.success && response.user) {
        setState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        
        return { success: true, user: response.user };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Registration failed',
        }));
        
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await authService.logout();
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Merge updates with current user
      const updatedUserData: User = { ...state.user, ...updates };
      const response = await authService.updateProfile(updatedUserData);
      
      if (response.success && response.user) {
        setState(prev => ({
          ...prev,
          user: response.user!,
          isLoading: false,
          error: null,
        }));
        
        return { success: true, user: response.user };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Profile update failed',
        }));
        
        return { success: false, error: response.message || 'Profile update failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      return { success: false, error: errorMessage };
    }
  }, [state.user]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    clearError,
  };
};
