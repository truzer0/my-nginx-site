"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface RegistrationFormProps {
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string;
  successMessage?: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onRegister,
  onSwitchToLogin,
  isLoading = false,
  error,
  successMessage,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleBlur = (field: keyof FormData) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Real-time validation for touched fields
    const errors: FormErrors = {};

    if (field === "name" && touched.name) {
      if (!formData.name.trim()) {
        errors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
      }
    }

    if (field === "email" && touched.email) {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (field === "password" && touched.password) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        errors.password = "Password must be at least 8 characters";
      }
    }

    if (field === "confirmPassword" && touched.confirmPassword) {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      ...errors,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (validateForm()) {
      await onRegister(formData.name.trim(), formData.email.trim(), formData.password);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="border-border bg-card shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-destructive/50 text-destructive [&>svg]:text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="border-green-500/50 text-green-400 [&>svg]:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange("name")}
                onBlur={handleBlur("name")}
                disabled={isLoading}
                className={`transition-all duration-200 ${
                  formErrors.name && touched.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-input focus-visible:ring-ring"
                }`}
              />
              {formErrors.name && touched.name && (
                <p className="text-sm text-destructive animate-in fade-in-0 duration-200">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange("email")}
                onBlur={handleBlur("email")}
                disabled={isLoading}
                className={`transition-all duration-200 ${
                  formErrors.email && touched.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-input focus-visible:ring-ring"
                }`}
              />
              {formErrors.email && touched.email && (
                <p className="text-sm text-destructive animate-in fade-in-0 duration-200">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  onBlur={handleBlur("password")}
                  disabled={isLoading}
                  className={`pr-10 transition-all duration-200 ${
                    formErrors.password && touched.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-input focus-visible:ring-ring"
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {formErrors.password && touched.password && (
                <p className="text-sm text-destructive animate-in fade-in-0 duration-200">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  disabled={isLoading}
                  className={`pr-10 transition-all duration-200 ${
                    formErrors.confirmPassword && touched.confirmPassword
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-input focus-visible:ring-ring"
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {formErrors.confirmPassword && touched.confirmPassword && (
                <p className="text-sm text-destructive animate-in fade-in-0 duration-200">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-primary hover:text-primary/80 transition-colors duration-200"
                onClick={onSwitchToLogin}
                disabled={isLoading}
              >
                Sign in here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};