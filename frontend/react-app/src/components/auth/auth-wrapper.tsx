"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';
import { RegistrationForm } from '@/components/auth/register-form';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, isLoading, isAuthenticated, error, login, register, clearError } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Wait a moment for auth provider to initialize
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSwitchToRegister = () => {
    clearError();
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    clearError();
    setAuthMode('login');
  };

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    await register(name, email, password);
  };

  // Show loading spinner during initialization
  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            {isInitializing ? 'Initializing...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Show main application if user is authenticated
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // Show authentication forms if user is not authenticated
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <motion.h1 
            className="text-3xl font-semibold tracking-tight text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {authMode === 'login' ? 'Welcome back' : 'Create account'}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {authMode === 'login' 
              ? 'Enter your credentials to access your account'
              : 'Enter your details to create a new account'
            }
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {authMode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm
                onLogin={handleLogin}
                onSwitchToRegister={handleSwitchToRegister}
                isLoading={isLoading}
                error={error || undefined}
              />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RegistrationForm
                onRegister={handleRegister}
                onSwitchToLogin={handleSwitchToLogin}
                isLoading={isLoading}
                error={error || undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Credentials */}
        <motion.div 
          className="mt-8 p-4 bg-card/50 border border-border rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials:</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>Admin: admin@example.com / admin123</div>
            <div>User: user@example.com / user123</div>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
};