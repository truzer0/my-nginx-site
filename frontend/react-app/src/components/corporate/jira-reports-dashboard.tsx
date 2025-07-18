"use client"

import React, { useState, useEffect } from 'react'
import { Calendar, Download, FileText, TrendingUp, Clock, Users, Target, Filter, Search, MoreHorizontal, AlertCircle, Calendar as CalendarIcon, ChevronRight, BarChart3, PieChart, Activity, CheckCircle, Circle, Clock3, AlertTriangle, User, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'

interface JiraTask {
  id?: string
  key?: string
  summary?: string
  status?: string
  statusCategory?: string
  issuetype?: string
  assignee?: string
  priority?: string
  updated?: string
  spent?: string
  url?: string
  project?: string
}

interface JiraReport {
  totalTasks: number
  totalSpent: string
  tasks: JiraTask[]
}

export default function JiraReportsDashboard() {
  const [report, setReport] = useState<JiraReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState(7)
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedAssignee, setSelectedAssignee] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()

  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'dd.MM.yyyy')
    } catch {
      return dateString
    }
  }

  const loadReport = async (days: number, forceRefresh = false) => {
    setLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      const start = format(startDate, 'yyyy-MM-dd')
      const end = format(endDate, 'yyyy-MM-dd')

      const url = `/api/jira/reports?start=${start}&end=${end}${forceRefresh ? '&force=true' : ''}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `HTTP error ${response.status}`)
      }

      const data = await response.json()
      setReport({
        totalTasks: data.totalTasks ?? 0,
        totalSpent: data.totalSpent ?? '0h',
        tasks: data.tasks ?? []
      })
    } catch (err) {
      console.error('Failed to load report:', err)
      setError(err instanceof Error ? err.message : 'Failed to load report')
      toast({
        title: "Error loading report",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = (report?.tasks || []).filter(task => {
    const projectMatch = selectedProject === 'all' || 
      (task.project && task.project.toLowerCase() === selectedProject.toLowerCase())
    
    const statusMatch = selectedStatus === 'all' || 
      (task.status && task.status.toLowerCase() === selectedStatus.toLowerCase())
    
    const assigneeMatch = selectedAssignee === 'all' || 
      (task.assignee && task.assignee.toLowerCase().replace(/\s+/g, '-') === selectedAssignee.toLowerCase())
    
    const searchMatch = !searchQuery || 
      (task.summary && task.summary.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return projectMatch && statusMatch && assigneeMatch && searchMatch
  })

  const projects = Array.from(
    new Set(
      (report?.tasks || [])
        .map(task => task.project)
        .filter(Boolean) as string[]
    )
  ).sort()

  const assignees = Array.from(
    new Set(
      (report?.tasks || [])
        .map(task => task.assignee)
        .filter(Boolean) as string[]
    )
  ).sort()

  useEffect(() => {
    loadReport(selectedPeriod)
  }, [selectedPeriod])

  const getStatusIcon = (statusCategory?: string) => {
    switch (statusCategory) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <Clock3 className="w-4 h-4 text-yellow-500" />
      case 'blocked':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status?: string, statusCategory?: string) => {
    if (!status) return null
    
    switch (statusCategory) {
      case 'done':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{status}</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{status}</Badge>
      case 'blocked':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{status}</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null
    
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">{priority}</Badge>
      case 'medium':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">{priority}</Badge>
      case 'low':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">{priority}</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">{priority}</Badge>
    }
  }

  const PeriodButtons = () => (
    <div className="flex gap-2">
      {[1, 7, 30, 90].map(days => (
        <Button
          key={days}
          variant={selectedPeriod === days ? "default" : "outline"}
          onClick={() => setSelectedPeriod(days)}
          className="border-border"
        >
          {days === 1 ? 'Day' : days === 7 ? 'Week' : days === 30 ? 'Month' : 'Quarter'}
        </Button>
      ))}
    </div>
  )

  if (loading && !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading Jira report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <div className="flex gap-3">
            <Button onClick={() => loadReport(selectedPeriod)}>Retry</Button>
            <Button variant="outline" onClick={() => loadReport(selectedPeriod, true)}>
              Force Refresh
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Jira Reports Dashboard</h1>
            <p className="text-muted-foreground mt-2">Track project progress and team performance</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <PeriodButtons />
            <Button variant="outline" className="border-border bg-surface hover:bg-surface/80">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{report?.totalTasks ?? 0}</div>
              <p className="text-xs text-muted-foreground">in selected period</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(report?.tasks || []).filter(t => t.statusCategory === 'done').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {report?.totalTasks && report.tasks 
                  ? `${Math.round((report.tasks.filter(t => t.statusCategory === 'done').length / report.totalTasks) * 100)}% completion rate` 
                  : '0% completion rate'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{report?.totalSpent ?? '0h'}</div>
              <p className="text-xs text-muted-foreground">total work logged</p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(report?.tasks || []).filter(t => t.statusCategory !== 'done').length}
              </div>
              <p className="text-xs text-muted-foreground">in progress or blocked</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Filter className="w-5 h-5 mr-2 text-primary" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project} value={project.toLowerCase()}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="all">All Assignees</SelectItem>
                  {assignees.map(assignee => (
                    <SelectItem 
                      key={assignee} 
                      value={assignee.toLowerCase().replace(/\s+/g, '-')}
                    >
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="to do">To Do</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Recent Tasks ({filteredTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Task ID</TableHead>
                    <TableHead className="text-muted-foreground">Title</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Assignee</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Priority</TableHead>
                    <TableHead className="text-muted-foreground">Updated</TableHead>
                    <TableHead className="text-muted-foreground">Time Spent</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id || Math.random()} className="border-border hover:bg-muted/50">
                        <TableCell className="font-mono text-primary">
                          {task.url ? (
                            <a href={task.url} target="_blank" rel="noopener noreferrer">
                              {task.key || 'N/A'}
                            </a>
                          ) : (
                            task.key || 'N/A'
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-foreground">{task.summary || 'No title'}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {task.issuetype || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{task.assignee || 'Unassigned'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.statusCategory)}
                            {getStatusBadge(task.status, task.statusCategory)}
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDisplayDate(task.updated)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {task.spent || '0h'}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No tasks found matching your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
