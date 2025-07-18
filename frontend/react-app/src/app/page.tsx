"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MainNavigation from "@/components/corporate/main-navigation"
import ResourceDashboard from "@/components/corporate/resource-dashboard"
import MessengerInterface from "@/components/corporate/messenger-interface"
import JiraReportsDashboard from "@/components/corporate/jira-reports-dashboard"
import UserProfileCard from "@/components/corporate/user-profile-card"
import AdminPanel from "@/components/corporate/admin-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { UsernameForm } from "@/components/auth/username-form"
import { ADLoginForm } from "@/components/auth/ad-login-form"
import { DBLoginForm } from "@/components/auth/db-login-form"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

type AuthMode = 'username' | 'ad' | 'db';

export default function HomePage() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("/resources");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('username');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState({
    name: "Загрузка...",
    email: "",
    role: "",
    isAdmin: false,
    avatar: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserData = async () => {
        try {
          const profileResponse = await fetch('/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!profileResponse.ok) throw new Error('Ошибка загрузки профиля');
          const profileData = await profileResponse.json();

          const adminResponse = await fetch(`/api/users/${profileData.id}/admin-button`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!adminResponse.ok) throw new Error('Ошибка проверки прав администратора');

          const adminData = await adminResponse.json();

          setUser({
            name: profileData.name || "Пользователь",
            email: profileData.email || "",
            role: profileData.role || "",
            isAdmin: adminData.showAdminButton,
            avatar: profileData.profile_image ? `/uploads/${profileData.profile_image}` :
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileData.name || "User")}`
          });

          setIsAuthenticated(true);
        } catch (error) {
          console.error('Ошибка загрузки данных:', error);
          handleLogout();
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentPath("/resources");
    setAuthMode('username');
    setUsername('');
    setError(null);
    toast({
      title: "Вы вышли из системы",
      description: "Ваш сеанс был завершен",
    });
  };

  const handleUsernameSubmit = async (username: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!response.ok) throw new Error('Ошибка проверки пользователя');

      const data = await response.json();
      setUsername(username);

      return { exists: data.exists };
    } catch (err) {
      console.error('Check user error:', err);
      setError('Ошибка проверки пользователя');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleADLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/authorization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации AD');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      toast({
        title: "Вход выполнен",
        description: "Вы успешно авторизовались",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка авторизации';
      setError(errorMessage);
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDBLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

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
      setIsAuthenticated(true);
      toast({
        title: "Вход выполнен",
        description: "Вы успешно авторизовались",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка авторизации';
      setError(errorMessage);
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const ProfilePage = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/resources")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к ресурсам
          </Button>
        </div>

        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Профиль пользователя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Имя</label>
                  <p className="text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Роль</label>
                  <p className="text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Статус аккаунта</label>
                  <p className="text-green-500">Активен</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Админ доступ</label>
                  <p className="text-muted-foreground">{user.isAdmin ? "Да" : "Нет"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Участник с</label>
                  <p className="text-muted-foreground">Декабрь 2024</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-medium text-foreground mb-4">Быстрые действия</h3>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleNavigation("/settings")}>
                  Редактировать профиль
                </Button>
                {user.isAdmin && (
                  <Button onClick={() => handleNavigation("/admin")}>
                    Панель администратора
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/resources")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к ресурсам
          </Button>
        </div>

        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Настройки пользователя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Настройки</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Email уведомления</p>
                      <p className="text-sm text-muted-foreground">Получать уведомления о активности</p>
                    </div>
                    <Button variant="outline" size="sm">Настроить</Button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Тема</p>
                      <p className="text-sm text-muted-foreground">Выберите предпочитаемую тему</p>
                    </div>
                    <Button variant="outline" size="sm">Темная</Button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Язык</p>
                      <p className="text-sm text-muted-foreground">Выберите предпочитаемый язык</p>
                    </div>
                    <Button variant="outline" size="sm">Русский</Button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Аккаунт</h3>
                <div className="flex gap-3">
                  <Button variant="outline">Изменить пароль</Button>
                  <Button variant="outline" onClick={() => handleNavigation("/profile")}>
                    Просмотр профиля
                  </Button>
                  <Button variant="destructive" onClick={handleLogout}>
                    Выйти
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentPath) {
      case "/resources":
        return <ResourceDashboard />;
      case "/messenger":
        return <MessengerInterface />;
      case "/reports":
        return <JiraReportsDashboard />;
      case "/publications":
        return <UserProfileCard
          onEditProfile={() => handleNavigation("/settings")}
          onAdminPanel={() => handleNavigation("/admin")}
        />;
      case "/admin":
        return <AdminPanel />;
      case "/profile":
        return <ProfilePage />;
      case "/settings":
        return <SettingsPage />;
      default:
        return <ResourceDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
                onSubmit={handleUsernameSubmit}
                onADLogin={() => {
                  clearError();
                  setAuthMode('ad');
                }}
                onDBLogin={() => {
                  clearError();
                  setAuthMode('db');
                }}
                isLoading={isLoading}
                error={error || undefined}
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
                onSubmit={handleADLogin}
                onBack={() => {
                  clearError();
                  setAuthMode('username');
                }}
                isLoading={isLoading}
                error={error || undefined}
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
                onSubmit={handleDBLogin}
                onBack={() => {
                  clearError();
                  setAuthMode('username');
                }}
                isLoading={isLoading}
                error={error || undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </AuthLayout>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation
        currentPath={currentPath}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        user={user}
        notificationCount={3}
      />

      <main className="min-h-[calc(100vh-64px)]">
        {renderCurrentSection()}
      </main>
    </div>
  );
}
