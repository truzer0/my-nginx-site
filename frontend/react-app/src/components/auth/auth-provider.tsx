"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  role: string;
  profile_image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithAD: (username: string, password: string) => Promise<void>;
  loginWithPassword: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);

  // Функция для безопасного декодирования JWT токена
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) throw new Error('Invalid token format');
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = atob(base64);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      throw new Error('Invalid token');
    }
  };

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (token) {
          // Здесь можно добавить проверку токена на сервере
          // Пока просто проверяем наличие токена
          setIsAuthenticated(true);

          // Декодируем токен для получения информации о пользователе
          const payload = decodeJWT(token);
          setUser({
            id: payload.id,
            username: payload.username,
            role: payload.role,
            profile_image: payload.profile_image
          });
        }
      } catch (err) {
        console.error('Auth check error:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Вход через AD
  const loginWithAD = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await fetch('/api/authorization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации через AD');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      const payload = decodeJWT(data.token);
      setUser({
        id: payload.id,
        username: payload.username,
        role: payload.role,
        profile_image: payload.profile_image
      });

      setIsAuthenticated(true);
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка авторизации';    
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Вход с паролем
  const loginWithPassword = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await fetch('/api/login-with-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      const payload = decodeJWT(data.token);
      setUser({
        id: payload.id,
        username: payload.username,
        role: payload.role,
        profile_image: payload.profile_image
      });

      setIsAuthenticated(true);
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка авторизации';    
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Выход
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    clearError();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      loginWithAD,
      loginWithPassword,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
