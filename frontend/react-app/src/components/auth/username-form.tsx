// frontend/react-app/src/components/auth/username-form.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface UsernameFormProps {
  onSubmit: (username: string) => Promise<{ exists: boolean }>;
  onADLogin: () => void;
  onDBLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

export const UsernameForm: React.FC<UsernameFormProps> = ({
  onSubmit,
  onADLogin,
  onDBLogin,
  isLoading = false,
  error,
}) => {
  const [username, setUsername] = useState("");
  const [userExists, setUserExists] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    try {
      const result = await onSubmit(username.trim());
      setUserExists(result.exists);
      
      if (result.exists) {
        onDBLogin();
      } else {
        onADLogin();
      }
    } catch (err) {
      console.error("Username check failed:", err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold">Вход в систему</CardTitle>
        <CardDescription>Введите ваше имя пользователя</CardDescription>
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
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              type="text"
              placeholder="Введите ваш логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Проверка...
              </>
            ) : (
              "Продолжить"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
