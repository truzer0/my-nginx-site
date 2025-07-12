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
  Menu
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
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface Resource {
  id: string
  name: string
  url: string
  description: string
  category: string
  icon: string
  usage: number
  createdAt: string
  status: 'active' | 'inactive'
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  lastActive: string
  joinedAt: string
  avatar: string
}

interface AnalyticsData {
  totalResources: number
  totalUsers: number
  activeUsers: number
  totalViews: number
  monthlyGrowth: number
  topResources: Array<{name: string, views: number}>
  userActivity: Array<{date: string, users: number}>
}

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Company Guidelines',
    url: '/guidelines',
    description: 'Complete company policies and procedures',
    category: 'Documentation',
    icon: '📋',
    usage: 1247,
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Design System',
    url: '/design-system',
    description: 'UI components and brand guidelines',
    category: 'Design',
    icon: '🎨',
    usage: 892,
    createdAt: '2024-01-08',
    status: 'active'
  },
  {
    id: '3',
    name: 'API Reference',
    url: '/api-docs',
    description: 'Technical documentation for developers',
    category: 'Technical',
    icon: '⚡',
    usage: 634,
    createdAt: '2024-01-20',
    status: 'active'
  },
  {
    id: '4',
    name: 'Training Materials',
    url: '/training',
    description: 'Employee onboarding and training resources',
    category: 'HR',
    icon: '📚',
    usage: 423,
    createdAt: '2024-01-12',
    status: 'inactive'
  }
]

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'admin',
    status: 'active',
    lastActive: '2024-01-25T10:30:00Z',
    joinedAt: '2023-06-15',
    avatar: 'SC'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@company.com',
    role: 'editor',
    status: 'active',
    lastActive: '2024-01-25T09:15:00Z',
    joinedAt: '2023-08-20',
    avatar: 'MR'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    email: 'emma.thompson@company.com',
    role: 'viewer',
    status: 'active',
    lastActive: '2024-01-24T16:45:00Z',
    joinedAt: '2023-11-03',
    avatar: 'ET'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'editor',
    status: 'inactive',
    lastActive: '2024-01-20T14:20:00Z',
    joinedAt: '2023-09-12',
    avatar: 'DK'
  }
]

const mockAnalytics: AnalyticsData = {
  totalResources: 47,
  totalUsers: 128,
  activeUsers: 89,
  totalViews: 15640,
  monthlyGrowth: 12.5,
  topResources: [
    { name: 'Company Guidelines', views: 1247 },
    { name: 'Design System', views: 892 },
    { name: 'API Reference', views: 634 },
    { name: 'Training Materials', views: 423 }
  ],
  userActivity: [
    { date: '2024-01-20', users: 45 },
    { date: '2024-01-21', users: 52 },
    { date: '2024-01-22', users: 38 },
    { date: '2024-01-23', users: 61 },
    { date: '2024-01-24', users: 47 },
    { date: '2024-01-25', users: 58 }
  ]
}

// Sidebar navigation links
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
  const [resources, setResources] = useState<Resource[]>(mockResources)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [showAddResourceDialog, setShowAddResourceDialog] = useState(false)
  const [newResource, setNewResource] = useState({
    name: '',
    url: '',
    description: '',
    category: '',
    icon: ''
  })
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  const validateResourceForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!newResource.name.trim()) {
      errors.name = 'Name is required'
    }
    if (!newResource.url.trim()) {
      errors.url = 'URL is required'
    }
    if (!newResource.description.trim()) {
      errors.description = 'Description is required'
    }
    if (!newResource.category) {
      errors.category = 'Category is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddResource = () => {
    if (validateResourceForm()) {
      const resource: Resource = {
        id: Date.now().toString(),
        ...newResource,
        usage: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      }
      setResources(prev => [...prev, resource])
      setNewResource({ name: '', url: '', description: '', category: '', icon: '' })
      setShowAddResourceDialog(false)
      setFormErrors({})
    }
  }

  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id))
    setSelectedResources(prev => prev.filter(resId => resId !== id))
  }

  const handleBulkDelete = () => {
    setResources(prev => prev.filter(resource => !selectedResources.includes(resource.id)))
    setSelectedResources([])
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

  const handleChangeUserRole = (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const handleDeactivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'inactive' } : user
    ))
  }

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
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
          <Sidebar className="bg-sidebar border-r border-sidebar-border">
            <SidebarBody>
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
                                <DialogTitle className="text-foreground">Add New Resource</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Create a new resource for your team to access
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="name" className="text-foreground">Name</Label>
                                  <Input
                                    id="name"
                                    value={newResource.name}
                                    onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter resource name"
                                    className={`bg-input border-border text-foreground ${formErrors.name ? 'border-destructive' : ''}`}
                                  />
                                  {formErrors.name && (
                                    <p className="text-destructive text-sm mt-1">{formErrors.name}</p>
                                  )}
                                </div>
                                
                                <div>
                                  <Label htmlFor="url" className="text-foreground">URL</Label>
                                  <Input
                                    id="url"
                                    value={newResource.url}
                                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                                    placeholder="/resource-path"
                                    className={`bg-input border-border text-foreground ${formErrors.url ? 'border-destructive' : ''}`}
                                  />
                                  {formErrors.url && (
                                    <p className="text-destructive text-sm mt-1">{formErrors.url}</p>
                                  )}
                                </div>
                                
                                <div>
                                  <Label htmlFor="category" className="text-foreground">Category</Label>
                                  <Select value={newResource.category} onValueChange={(value) => setNewResource(prev => ({ ...prev, category: value }))}>
                                    <SelectTrigger className={`bg-input border-border text-foreground ${formErrors.category ? 'border-destructive' : ''}`}>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                      <SelectItem value="Documentation">Documentation</SelectItem>
                                      <SelectItem value="Design">Design</SelectItem>
                                      <SelectItem value="Technical">Technical</SelectItem>
                                      <SelectItem value="HR">HR</SelectItem>
                                      <SelectItem value="Marketing">Marketing</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {formErrors.category && (
                                    <p className="text-destructive text-sm mt-1">{formErrors.category}</p>
                                  )}
                                </div>
                                
                                <div>
                                  <Label htmlFor="icon" className="text-foreground">Icon (Emoji)</Label>
                                  <Input
                                    id="icon"
                                    value={newResource.icon}
                                    onChange={(e) => setNewResource(prev => ({ ...prev, icon: e.target.value }))}
                                    placeholder="📋"
                                    className="bg-input border-border text-foreground"
                                    maxLength={2}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="description" className="text-foreground">Description</Label>
                                  <Textarea
                                    id="description"
                                    value={newResource.description}
                                    onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe what this resource contains"
                                    className={`bg-input border-border text-foreground ${formErrors.description ? 'border-destructive' : ''}`}
                                    rows={3}
                                  />
                                  {formErrors.description && (
                                    <p className="text-destructive text-sm mt-1">{formErrors.description}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowAddResourceDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddResource} className="bg-primary text-primary-foreground">
                                  Add Resource
                                </Button>
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
                              <TableHead className="text-foreground">Resource</TableHead>
                              <TableHead className="text-foreground">Category</TableHead>
                              <TableHead className="text-foreground">Usage</TableHead>
                              <TableHead className="text-foreground">Status</TableHead>
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
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">{resource.icon}</span>
                                    <div>
                                      <div className="font-medium text-foreground">{resource.name}</div>
                                      <div className="text-sm text-muted-foreground">{resource.description}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                    {resource.category}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {resource.usage.toLocaleString()} views
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={resource.status === 'active' ? 'default' : 'secondary'}
                                    className={resource.status === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                                  >
                                    {resource.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {formatDate(resource.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                      <Edit className="h-4 w-4" />
                                    </Button>
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
                                            Are you sure you want to delete "{resource.name}"? This action cannot be undone.
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
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                          <Card key={user.id} className="bg-muted border-border">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                      {user.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium text-foreground">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                  <span className="text-xs text-muted-foreground">{user.status}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Role</span>
                                  <Badge 
                                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                                    className={
                                      user.role === 'admin' ? 'bg-primary text-primary-foreground' : 
                                      user.role === 'editor' ? 'bg-muted text-muted-foreground' :
                                      'bg-muted text-muted-foreground'
                                    }
                                  >
                                    {user.role}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Last Active</span>
                                  <span className="text-sm text-foreground">{formatLastActive(user.lastActive)}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Joined</span>
                                  <span className="text-sm text-foreground">{formatDate(user.joinedAt)}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-foreground">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                
                                <div className="relative">
                                  <Select 
                                    value={user.role}
                                    onValueChange={(value) => handleChangeUserRole(user.id, value as any)}
                                  >
                                    <SelectTrigger className="h-8 px-2 text-xs bg-transparent border-none hover:bg-accent/10">
                                      <div className="flex items-center gap-1">
                                        <UserCog className="h-3 w-3" />
                                        <span>Role</span>
                                      </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="editor">Editor</SelectItem>
                                      <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

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
                            </CardContent>
                          </Card>
                        ))}
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
                            <p className="text-2xl font-semibold text-foreground">{mockAnalytics.totalResources}</p>
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
                            <p className="text-2xl font-semibold text-foreground">{mockAnalytics.totalUsers}</p>
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
                            <p className="text-2xl font-semibold text-foreground">{mockAnalytics.activeUsers}</p>
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
                            <p className="text-2xl font-semibold text-foreground">+{mockAnalytics.monthlyGrowth}%</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-surface border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground">Top Resources</CardTitle>
                        <CardDescription className="text-muted-foreground">Most accessed resources this month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockAnalytics.topResources.map((resource, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">#{index + 1}</span>
                                </div>
                                <span className="font-medium text-foreground">{resource.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{resource.views} views</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-surface border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground">User Activity</CardTitle>
                        <CardDescription className="text-muted-foreground">Daily active users over the past week</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockAnalytics.userActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{formatDate(activity.date)}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${(activity.users / 70) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-foreground w-8">{activity.users}</span>
                              </div>
                            </div>
                          ))}
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