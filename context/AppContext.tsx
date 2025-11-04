import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface AppState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isOnline: boolean;
}

interface AppContextType extends AppState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  clearMessages: () => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    error: null,
    success: null,
    isOnline: true,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, success: null }));
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    setState(prev => ({ ...prev, success, error: null }));
  }, []);

  const setOnlineStatus = useCallback((isOnline: boolean) => {
    setState(prev => ({ ...prev, isOnline }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  const showError = useCallback((message: string) => {
    setState(prev => ({ ...prev, error: message, success: null }));
    // Auto-clear after 5 seconds
    setTimeout(() => {
      setState(prev => ({ ...prev, error: null }));
    }, 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setState(prev => ({ ...prev, success: message, error: null }));
    // Auto-clear after 3 seconds
    setTimeout(() => {
      setState(prev => ({ ...prev, success: null }));
    }, 3000);
  }, []);

  const value: AppContextType = {
    ...state,
    setLoading,
    setError,
    setSuccess,
    setOnlineStatus,
    clearMessages,
    showError,
    showSuccess,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
