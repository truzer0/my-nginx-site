"use client"

import { useState } from "react"
import MainNavigation from "@/components/corporate/main-navigation"
import ResourceDashboard from "@/components/corporate/resource-dashboard"
import MessengerInterface from "@/components/corporate/messenger-interface"
import JiraReportsDashboard from "@/components/corporate/jira-reports-dashboard"
import UserProfileCard from "@/components/corporate/user-profile-card"
import AdminPanel from "@/components/corporate/admin-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HomePage() {
  const [currentPath, setCurrentPath] = useState("/resources")
  const [user] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Senior Manager",
    isAdmin: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  })

  const handleNavigation = (path: string) => {
    setCurrentPath(path)
  }

  const handleLogout = () => {
    console.log("Logging out...")
    setCurrentPath("/resources")
    alert("Logged out successfully!")
  }

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
            Back to Resources
          </Button>
        </div>
        
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <p className="text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Role</label>
                  <p className="text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Account Status</label>
                  <p className="text-green-500">Active</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Admin Access</label>
                  <p className="text-muted-foreground">{user.isAdmin ? "Yes" : "No"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Member Since</label>
                  <p className="text-muted-foreground">January 2024</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-medium text-foreground mb-4">Quick Actions</h3>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleNavigation("/settings")}>
                  Edit Profile
                </Button>
                {user.isAdmin && (
                  <Button onClick={() => handleNavigation("/admin")}>
                    Access Admin Panel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

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
            Back to Resources
          </Button>
        </div>
        
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">User Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email updates about activity</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Theme</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                    </div>
                    <Button variant="outline" size="sm">Dark Mode</Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Language</p>
                      <p className="text-sm text-muted-foreground">Select your language preference</p>
                    </div>
                    <Button variant="outline" size="sm">English</Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Account</h3>
                <div className="flex gap-3">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline" onClick={() => handleNavigation("/profile")}>
                    View Profile
                  </Button>
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentPath) {
      case "/resources":
        return <ResourceDashboard />
      case "/messenger":
        return <MessengerInterface />
      case "/reports":
        return <JiraReportsDashboard />
      case "/publications":
        return <UserProfileCard />
      case "/admin":
        return <AdminPanel />
      case "/profile":
        return <ProfilePage />
      case "/settings":
        return <SettingsPage />
      default:
        return <ResourceDashboard />
    }
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
  )
}
