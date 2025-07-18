"use client"

import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Settings,
  BarChart3,
  Database,
  Globe,
  Star,
  MoreVertical,
  Filter,
  CheckSquare,
  Eye,
  UserCog,
  UserX,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  Menu,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sidebar, SidebarProvider, useSidebar, SidebarBody } from "@/components/ui/sidebar"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface Resource {
  id: string
  url: string
  button_text: string
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  username: string
  role: 'admin' | 'editor' | 'user'
  status: 'active' | 'inactive'
  lastActive: string
  joinedAt: string
  profile_image?: string
}

const sidebarLinks = [
  {
    label: "Resource Management",
    href: "#resources",
    icon: <Database className="h-4 w-4" />
  },
  {
    label: "User Management",
    href: "#users",
    icon: <Users className="h-4 w-4" />
  },
  {
    label: "Analytics",
    href: "#analytics",
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    label: "Settings",
    href: "#settings",
    icon: <Settings className="h-4 w-4" />
  }
]

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('resources')
  const [resources, setResources] = useState<Resource[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [showAddResourceDialog, setShowAddResourceDialog] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [newResource, setNewResource] = useState({
    url: '',
    button_text: ''
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const { toast } = useToast()

  useEffect(() => {
    if (activeTab === 'resources') {
      loadLinks()
    } else if (activeTab === 'users') {
      loadUsers()
    }
  }, [activeTab])

  const loadLinks = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token found')

      const response = await fetch('/api/links', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      if (!response.ok) throw new Error('Failed to fetch links')
      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error('Error loading links:', error)
      toast({
        title: 'Error',
        description: 'Failed to load links',
        variant: 'destructive'
      })
    }
  }

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token found')

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      })
    }
  }

  const validateResourceForm = () => {
    const errors: {[key: string]: string} = {}

    if (currentStep === 1 && !newResource.url.trim()) {
      errors.url = 'URL is required'
    }
    if (currentStep === 2 && !newResource.button_text.trim()) {
      errors.button_text = 'Button text is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateResourceForm()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleAddResource = async () => {
    if (validateResourceForm()) {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error("No authentication token found")

        const response = await fetch('/api/links', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newResource)
        })

        if (!response.ok) throw new Error("Failed to add resource")

        const data = await response.json()
        toast({
          title: 'Success',
          description: data.message || 'Link added successfully',
        })
        
        loadLinks()
        setNewResource({ url: '', button_text: '' })
        setCurrentStep(1)
        setShowAddResourceDialog(false)
        setFormErrors({})
      } catch (error) {
        console.error("Error adding resource:", error)
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to add resource',
          variant: 'destructive'
        })
      }
    }
  }

  const handleDeleteResource = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error("No authentication token found")

      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      if (!response.ok) throw new Error('Failed to delete link')

      const data = await response.json()
      toast({
        title: 'Success',
        description: data.message || 'Link deleted successfully',
      })
      
      loadLinks()
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete resource',
        variant: 'destructive'
      })
    }
  }

  const handleBulkDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error("No authentication token found")

      const response = await fetch('/api/links/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ ids: selectedResources })
      })

      if (!response.ok) throw new Error('Failed to delete resources')

      const data = await response.json()
      toast({
        title: 'Success',
        description: data.message || 'Resources deleted successfully',
      })
      
      loadLinks()
      setSelectedResources([])
    } catch (error) {
      console.error('Error bulk deleting resources:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete resources',
        variant: 'destructive'
      })
    }
  }

  const handleSelectResource = (id: string) => {
    setSelectedResources(prev =>
      prev.includes(id)
        ? prev.filter(resId => resId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAllResources = () => {
    const filteredResourceIds = filteredResources.map(resource => resource.id)
    setSelectedResources(prev =>
      prev.length === filteredResourceIds.length
        ? []
        : filteredResourceIds
    )
  }

  const handleChangeUserRole = async (userId: string, newRole: 'admin' | 'editor' | 'user') => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error("No authentication token found")

      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) throw new Error('Failed to change user role')

      const data = await response.json()
      toast({
        title: 'Success',
        description: data.message || 'User role updated successfully',
      })
      
      loadUsers()
    } catch (error) {
      console.error('Error changing user role:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change user role',
        variant: 'destructive'
      })
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error("No authentication token found")

      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      if (!response.ok) throw new Error('Failed to deactivate user')

      const data = await response.json()
      toast({
        title: 'Success',
        description: data.message || 'User deactivated successfully',
      })
      
      loadUsers()
    } catch (error) {
      console.error('Error deactivating user:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to deactivate user',
        variant: 'destructive'
      })
    }
  }

  const filteredResources = resources.filter(resource =>
    resource.button_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))    

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar>
            <SidebarBody className="bg-sidebar border-r border-sidebar-border">
              <div className="space-y-6">
                <div className="p-6 border-b border-sidebar-border">
                  <h1 className="text-xl font-semibold text-sidebar-foreground">Admin Panel</h1>
                </div>

                <div className="px-6">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3">
                      Management
                    </p>
                    {sidebarLinks.map((link) => (
                      <Button
                        key={link.href}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 h-10",
                          activeTab === link.href.replace('#', '')
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                        )}
                        onClick={() => setActiveTab(link.href.replace('#', ''))}
                      >
                        {link.icon}
                        <span className="text-sm font-medium">{link.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SidebarBody>
          </Sidebar>

          <main className="flex-1 flex flex-col bg-background">
            <header className="border-b border-border bg-surface p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-semibold text-foreground">
                  {activeTab === 'resources' && 'Resource Management'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'analytics' && 'Analytics Dashboard'}
                  {activeTab === 'settings' && 'System Settings'}
                </h2>
              </div>
            </header>

            <div className="flex-1 p-4 lg:p-6 bg-background overflow-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="hidden">
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="space-y-6">
                  <Card className="bg-surface border-border">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-foreground">Resources</CardTitle>   
                          <CardDescription className="text-muted-foreground">
                            Manage your company resources and documentation
                          </CardDescription>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          {selectedResources.length > 0 && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Selected ({selectedResources.length})
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-surface border-border">  
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-foreground">Delete Resources</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    Are you sure you want to delete {selectedResources.length} selected resource(s)? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          <Dialog open={showAddResourceDialog} onOpenChange={setShowAddResourceDialog}>
                            <DialogTrigger asChild>
                              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Resource
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-surface border-border">
                              <DialogHeader>
                                <DialogTitle className="text-foreground">
                                  {currentStep === 1 ? 'Step 1: Enter URL' : 'Step 2: Enter Button Text'}
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">    
                                  {currentStep === 1 ? 'Provide the link URL' : 'Set the display text for the button'}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4">
                                {currentStep === 1 && (
                                  <div>
                                    <Label htmlFor="url" className="text-foreground">URL</Label>
                                    <Input
                                      id="url"
                                      value={newResource.url}
                                      onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                                      placeholder="https://example.com"
                                      className={`bg-input border-border text-foreground ${formErrors.url ? 'border-destructive' : ''}`}
                                    />
                                    {formErrors.url && (
                                      <p className="text-destructive text-sm mt-1">{formErrors.url}</p>
                                    )}
                                  </div>
                                )}

                                {currentStep === 2 && (
                                  <div>
                                    <Label htmlFor="button_text" className="text-foreground">Button Text</Label>
                                    <Input
                                      id="button_text"
                                      value={newResource.button_text}
                                      onChange={(e) => setNewResource(prev => ({ ...prev, button_text: e.target.value }))}
                                      placeholder="Click here"
                                      className={`bg-input border-border text-foreground ${formErrors.button_text ? 'border-destructive' : ''}`}
                                    />
                                    {formErrors.button_text && (
                                      <p className="text-destructive text-sm mt-1">{formErrors.button_text}</p>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between gap-3">
                                <div>
                                  {currentStep === 2 && (
                                    <Button variant="outline" onClick={prevStep}>
                                      <ChevronLeft className="h-4 w-4 mr-2" />
                                      Back
                                    </Button>
                                  )}
                                </div>
                                <div className="flex gap-3">
                                  <Button variant="outline" onClick={() => {
                                    setShowAddResourceDialog(false)
                                    setCurrentStep(1)
                                    setNewResource({ url: '', button_text: '' })
                                    setFormErrors({})
                                  }}>
                                    Cancel
                                  </Button>
                                  {currentStep === 1 ? (
                                    <Button onClick={nextStep}>
                                      Next <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                  ) : (
                                    <Button onClick={handleAddResource}>
                                      Add Resource
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-input border-border text-foreground"     
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="rounded-md border border-border overflow-hidden">  
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border hover:bg-muted/5">        
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={selectedResources.length === filteredResources.length && filteredResources.length > 0}
                                  onCheckedChange={handleSelectAllResources}
                                  className="border-border"
                                />
                              </TableHead>
                              <TableHead className="text-foreground">Button Text</TableHead>
                              <TableHead className="text-foreground">URL</TableHead>
                              <TableHead className="text-foreground">Created</TableHead>
                              <TableHead className="text-right text-foreground">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredResources.map((resource) => (
                              <TableRow key={resource.id} className="border-border hover:bg-muted/5">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedResources.includes(resource.id)}    
                                    onCheckedChange={() => handleSelectResource(resource.id)}
                                    className="border-border"
                                  />
                                </TableCell>
                                <TableCell className="font-medium text-foreground">
                                  {resource.button_text}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {resource.url}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {formatDate(resource.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">  
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-surface border-border">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-foreground">Delete Resource</AlertDialogTitle>
                                          <AlertDialogDescription className="text-muted-foreground">
                                            Are you sure you want to delete this link?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>  
                                          <AlertDialogAction
                                            onClick={() => handleDeleteResource(resource.id)}
                                            className="bg-destructive text-destructive-foreground"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                  <Card className="bg-surface border-border">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-foreground">User Management</CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Manage user accounts and permissions
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search users..."
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="pl-10 bg-input border-border text-foreground"     
                          />
                        </div>
                        <Select value={filterRole} onValueChange={setFilterRole}>        
                          <SelectTrigger className="w-full sm:w-48 bg-input border-border text-foreground">
                            <SelectValue placeholder="Filter by role" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border hover:bg-muted/5">
                              <TableHead className="text-foreground">Name</TableHead>
                              <TableHead className="text-foreground">Username</TableHead>
                              <TableHead className="text-foreground">Role</TableHead>
                              <TableHead className="text-foreground">Status</TableHead>
                              <TableHead className="text-right text-foreground">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user) => (
                              <TableRow key={user.id} className="border-border hover:bg-muted/5">
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      {user.profile_image ? (
                                        <img 
                                          src={`/uploads/${user.profile_image}`} 
                                          alt={user.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                          {user.name.charAt(0)}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-foreground">{user.name}</div>
                                      <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {user.username}
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={user.role}
                                    onValueChange={(value) => handleChangeUserRole(user.id, value as any)}
                                  >
                                    <SelectTrigger className="w-[120px] bg-input border-border text-foreground">
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="editor">Editor</SelectItem>
                                      <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={user.status === 'active' ? 'default' : 'secondary'}
                                    className={user.status === 'active' ? 'bg-green-500 text-primary-foreground' : 'bg-muted text-muted-foreground'}
                                  >
                                    {user.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {user.status === 'active' && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                                            <UserX className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-surface border-border">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle className="text-foreground">Deactivate User</AlertDialogTitle>
                                            <AlertDialogDescription className="text-muted-foreground">
                                              Are you sure you want to deactivate {user.name}? They will lose access to the platform.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>    
                                            <AlertDialogAction
                                              onClick={() => handleDeactivateUser(user.id)}  
                                              className="bg-destructive text-destructive-foreground"
                                            >
                                              Deactivate
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
                    <Card className="bg-surface border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Resources</p>
                            <p className="text-2xl font-semibold text-foreground">{resources.length}</p>
                          </div>
                          <Database className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-surface border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Users</p> 
                            <p className="text-2xl font-semibold text-foreground">{users.length}</p>
                          </div>
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-surface border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Active Users</p>
                            <p className="text-2xl font-semibold text-foreground">
                              {users.filter(u => u.status === 'active').length}
                            </p>
                          </div>
                          <Activity className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-surface border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Growth</p>
                            <p className="text-2xl font-semibold text-foreground">+12.5%</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card className="bg-surface border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">System Settings</CardTitle> 
                      <CardDescription className="text-muted-foreground">
                        Configure system-wide settings and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-muted border-border">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Shield className="h-5 w-5 text-primary" />
                              <h3 className="font-medium text-foreground">Security</h3>  
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">        
                                <span className="text-sm text-muted-foreground">Two-factor authentication</span>
                                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                              </div>
                              <div className="flex items-center justify-between">        
                                <span className="text-sm text-muted-foreground">Session timeout</span>
                                <span className="text-sm text-foreground">24 hours</span>
                              </div>
                              <div className="flex items-center justify-between">        
                                <span className="text-sm text-muted-foreground">Password policy</span>
                                <Badge className="bg-primary text-primary-foreground">Strong</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted border-border">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Globe className="h-5 w-5 text-primary" />
                              <h3 className="font-medium text-foreground">General</h3>   
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">        
                                <span className="text-sm text-muted-foreground">Default language</span>
                                <span className="text-sm text-foreground">English</span> 
                              </div>
                              <div className="flex items-center justify-between">        
                                <span className="text-sm text-muted-foreground">Time zone</span>
                                <span className="text-sm text-foreground">UTC-8</span>   
                              </div>
                              <div className="flex items-center justify-between">        
                                <span className="text-sm text-muted-foreground">Auto-backup</span>
                                <Badge className="bg-green-100 text-green-800">Daily</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">Danger Zone</h3> 
                            <p className="text-sm text-muted-foreground">Irreversible and destructive actions</p>
                          </div>
                          <Button variant="destructive" className="bg-destructive text-destructive-foreground">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Reset All Data
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
