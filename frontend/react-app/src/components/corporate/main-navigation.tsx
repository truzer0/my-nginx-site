"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Shield,
  ChevronDown
} from "lucide-react"

interface MainNavigationProps {
  currentPath?: string
  onNavigate?: (path: string) => void
  onLogout?: () => void
  user?: {
    name: string
    email: string
    role: string
    avatar?: string
    isAdmin?: boolean
  }
  notificationCount?: number
}

const navigationItems = [
  { name: "Resources", path: "/resources" },
  { name: "Messenger", path: "/messenger" },
  { name: "Reports", path: "/reports" },
  { name: "Publications", path: "/publications" }
]

export default function MainNavigation({
  currentPath = "",
  onNavigate,
  onLogout,
  user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Senior Manager",
    isAdmin: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  notificationCount = 3
}: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = (path: string) => {
    onNavigate?.(path)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    onLogout?.()
  }

  const handleProfileView = () => {
    onNavigate?.("/profile")
  }

  const handleAdminPanel = () => {
    onNavigate?.("/admin")
  }

  const handleSettings = () => {
    onNavigate?.("/settings")
  }

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="text-xl font-semibold text-primary font-[var(--font-inter)]">
                Corporate
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.path
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => handleNavClick(item.path)}
                    className={`
                      relative px-3 py-2 text-sm font-medium transition-colors duration-200
                      font-[var(--font-inter)]
                      ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                      }
                    `}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-foreground font-[var(--font-inter)]">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-[var(--font-inter)]">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                <DropdownMenuLabel className="font-[var(--font-inter)]">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer font-[var(--font-inter)]"
                  onClick={handleProfileView}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem 
                    className="cursor-pointer font-[var(--font-inter)]"
                    onClick={handleAdminPanel}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  className="cursor-pointer font-[var(--font-inter)]"
                  onClick={handleSettings}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive font-[var(--font-inter)]"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-surface border-t border-border"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.path
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => handleNavClick(item.path)}
                  className={`
                    w-full justify-start text-base font-medium
                    font-[var(--font-inter)]
                    ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    }
                  `}
                >
                  {item.name}
                </Button>
              )
            })}
          </div>

          {/* Mobile User Section */}
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5 space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="text-base font-medium text-foreground font-[var(--font-inter)]">
                  {user.name}
                </div>
                <div className="text-sm text-muted-foreground font-[var(--font-inter)]">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start font-[var(--font-inter)]"
                onClick={handleProfileView}
              >
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
              {user.isAdmin && (
                <Button
                  variant="ghost"
                  className="w-full justify-start font-[var(--font-inter)]"
                  onClick={handleAdminPanel}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start font-[var(--font-inter)]"
                onClick={handleSettings}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-destructive font-[var(--font-inter)]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}