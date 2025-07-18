// frontend/react-app/src/components/auth/ad-login-form.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

interface ADLoginFormProps {
  username: string;
  onSubmit: (username: string, password: string) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
}

export const ADLoginForm: React.FC<ADLoginFormProps> = ({
  username,
  onSubmit,
  onBack,
  isLoading = false,
  error,
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    await onSubmit(username, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <Button
          variant="ghost"
          className="w-auto p-0 mb-2"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <CardTitle className="text-2xl font-semibold">Вход через Active Directory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adPassword">Пароль AD</Label>
            <Input
              id="adPassword"
              type="password"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
