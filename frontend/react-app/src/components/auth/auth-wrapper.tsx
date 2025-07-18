"use client";

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { AuthLayout } from '@/components/auth/auth-layout';
import { UsernameForm } from '@/components/auth/username-form';
import { ADLoginForm } from '@/components/auth/ad-login-form';
import { DBLoginForm } from '@/components/auth/db-login-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type AuthMode = 'username' | 'ad' | 'db';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isAuthenticated, error, clearError } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('username');
  const [username, setUsername] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Проверяем инициализацию
  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Обработчики для смены режимов
  const handleUsernameSubmit = async (username: string) => {
    try {
      const response = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!response.ok) throw new Error('Ошибка проверки пользователя');
      return await response.json();
    } catch (error) {
      console.error('Check user error:', error);
      throw error;
    }
  };

  const handleADLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/authorization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error('Ошибка авторизации AD');
      return await response.json();
    } catch (error) {
      console.error('AD login error:', error);
      throw error;
    }
  };

  const handleDBLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/login-with-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error('Ошибка авторизации по паролю');
      return await response.json();
    } catch (error) {
      console.error('DB login error:', error);
      throw error;
    }
  };

  // Показываем загрузку при инициализации
  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">      
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            {isInitializing ? 'Инициализация...' : 'Загрузка...'}
          </p>
        </div>
      </div>
    );
  }

  // Если пользователь авторизован - показываем основное приложение
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // Рендерим соответствующую форму авторизации
  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {authMode === 'username' && (
          <motion.div
            key="username"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <UsernameForm
              onSubmit={async (username) => {
                const result = await handleUsernameSubmit(username);
                setUsername(username);
                return result;
              }}
              onADLogin={() => {
                clearError();
                setAuthMode('ad');
              }}
              onDBLogin={() => {
                clearError();
                setAuthMode('db');
              }}
              isLoading={isLoading}
              error={error || undefined} // Преобразуем null в undefined
            />
          </motion.div>
        )}

        {authMode === 'ad' && (
          <motion.div
            key="ad"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ADLoginForm
              username={username}
              onSubmit={async (username, password) => {
                await handleADLogin(username, password);
              }}
              onBack={() => {
                clearError();
                setAuthMode('username');
              }}
              isLoading={isLoading}
              error={error || undefined} // Преобразуем null в undefined
            />
          </motion.div>
        )}

        {authMode === 'db' && (
          <motion.div
            key="db"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DBLoginForm
              username={username}
              onSubmit={async (username, password) => {
                await handleDBLogin(username, password);
              }}
              onBack={() => {
                clearError();
                setAuthMode('username');
              }}
              isLoading={isLoading}
              error={error || undefined} // Преобразуем null в undefined
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};
