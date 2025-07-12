"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  login as authLogin, 
  register as authRegister, 
  logout as authLogout, 
  getCurrentUser, 
  isAuthenticated as checkIsAuthenticated,
  getAuthToken,
  isTokenExpired 
} from '@/lib/auth';
import type { User } from '@/lib/auth';

// Authentication context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Authentication provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error helper
  const clearError = () => setError(null);

  // Initialize auth state from localStorage
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated using the auth library
      const authenticated = checkIsAuthenticated();
      
      if (authenticated) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticatedState(true);
        } else {
          setUser(null);
          setIsAuthenticatedState(false);
        }
      } else {
        setUser(null);
        setIsAuthenticatedState(false);
      }
    } catch (err) {
      console.error('Failed to initialize auth state:', err);
      setUser(null);
      setIsAuthenticatedState(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();

      const user = await authLogin(email, password);
      
      // Update auth state
      setUser(user);
      setIsAuthenticatedState(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();

      const user = await authRegister(name, email, password);
      
      // Update auth state
      setUser(user);
      setIsAuthenticatedState(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Call auth logout utility
      authLogout();
      
      // Clear auth state
      setUser(null);
      setIsAuthenticatedState(false);
      clearError();
    } catch (err) {
      console.error('Logout error:', err);
      // Force clear state even if logout utility fails
      setUser(null);
      setIsAuthenticatedState(false);
      clearError();
    }
  };

  // Check for token expiration periodically
  useEffect(() => {
    if (isAuthenticatedState) {
      const interval = setInterval(() => {
        if (isTokenExpired()) {
          logout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticatedState]);

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Clear errors after successful operations
  useEffect(() => {
    if (isAuthenticatedState && error) {
      clearError();
    }
  }, [isAuthenticatedState, error]);

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated: isAuthenticatedState,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;