"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Building2, Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/20" />
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Geometric Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-24 h-24 border border-border/20 rounded-lg"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-16 w-16 h-16 bg-primary/5 rounded-full"
          animate={{ 
            y: [-20, 20, -20],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div 
          className="absolute top-1/3 right-10 w-32 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          animate={{ 
            scaleX: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Logo/Branding */}
        <motion.header 
          className="p-6 lg:p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">SecureAuth</h1>
              <p className="text-sm text-muted-foreground">Enterprise Security Platform</p>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Content Container */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              {title && (
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
                  <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
                </motion.div>
              )}
              
              {/* Form Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer 
          className="p-6 lg:p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>© 2024 SecureAuth Corporation</span>
              </div>
              
              <div className="flex items-center gap-6">
                <a 
                  href="#" 
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a 
                  href="#" 
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Support
                </a>
              </div>
            </div>
            
            <motion.div 
              className="mt-4 pt-4 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <p className="text-xs text-muted-foreground">
                Trusted by enterprises worldwide for secure authentication and identity management
              </p>
            </motion.div>
          </div>
        </motion.footer>
      </div>

      {/* Ambient Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </div>
  );
};