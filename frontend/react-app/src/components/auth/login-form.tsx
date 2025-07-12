"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  onSwitchToRegister: () => void
  isLoading?: boolean
  error?: string
}

interface FormErrors {
  email?: string
  password?: string
  form?: string
}

export const LoginForm = ({ onLogin, onSwitchToRegister, isLoading = false, error }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  // Clear errors when error prop changes
  useEffect(() => {
    if (error) {
      setErrors(prev => ({ ...prev, form: error }))
    } else {
      setErrors(prev => ({ ...prev, form: undefined }))
    }
  }, [error])

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return undefined
  }

  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    setErrors({
      email: emailError,
      password: passwordError
    })

    return !emailError && !passwordError
  }

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))

    // Real-time validation for touched fields
    if (touched[field]) {
      if (field === 'email') {
        const emailError = validateEmail(value)
        setErrors(prev => ({ ...prev, email: emailError }))
      } else if (field === 'password') {
        const passwordError = validatePassword(value)
        setErrors(prev => ({ ...prev, password: passwordError }))
      }
    }

    // Clear form error when user starts typing
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: undefined }))
    }
  }

  const handleInputBlur = (field: keyof typeof touched) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))

    // Validate on blur
    if (field === 'email') {
      const emailError = validateEmail(formData.email)
      setErrors(prev => ({ ...prev, email: emailError }))
    } else if (field === 'password') {
      const passwordError = validatePassword(formData.password)
      setErrors(prev => ({ ...prev, password: passwordError }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({ email: true, password: true })

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      await onLogin(formData.email, formData.password)
    } catch (err) {
      // Error handling is managed by parent component through error prop
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = () => {
    // This would typically open a forgot password modal or navigate to forgot password page
    console.log('Forgot password clicked')
  }

  const isFormLoading = isLoading || isSubmitting

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold text-foreground">Sign In</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {(errors.form || error) && (
          <Alert variant="destructive" className="animate-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.form || error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              onBlur={handleInputBlur('email')}
              disabled={isFormLoading}
              className={`transition-all duration-200 ${
                errors.email 
                  ? 'border-destructive focus-visible:ring-destructive' 
                  : 'focus-visible:ring-primary'
              }`}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.email}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                onBlur={handleInputBlur('password')}
                disabled={isFormLoading}
                className={`pr-10 transition-all duration-200 ${
                  errors.password 
                    ? 'border-destructive focus-visible:ring-destructive' 
                    : 'focus-visible:ring-primary'
                }`}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isFormLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm text-primary hover:text-accent-hover"
              onClick={handleForgotPassword}
              disabled={isFormLoading}
            >
              Forgot your password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-accent-hover text-primary-foreground font-medium py-2.5 transition-all duration-200 disabled:opacity-50"
            disabled={isFormLoading}
          >
            {isFormLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button
              type="button"
              variant="link"
              className="px-0 text-primary hover:text-accent-hover font-medium"
              onClick={onSwitchToRegister}
              disabled={isFormLoading}
            >
              Create one here
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}