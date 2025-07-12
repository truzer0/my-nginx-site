"use client"

import React, { useState } from 'react'
import { Calendar, Download, FileText, TrendingUp, Clock, Users, Target, Filter, Search, MoreHorizontal, AlertCircle, Calendar as CalendarIcon, ChevronRight, BarChart3, PieChart, Activity, CheckCircle, Circle, Clock3, AlertTriangle, User } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Mock data
const mockTasks = [
  { id: 'PROJ-1234', title: 'Implement user authentication system', assignee: 'John Doe', status: 'done', priority: 'high', dueDate: '2024-01-15', project: 'Phoenix' },
  { id: 'PROJ-1235', title: 'Design new dashboard layout', assignee: 'Sarah Smith', status: 'in-progress', priority: 'medium', dueDate: '2024-01-18', project: 'Phoenix' },
  { id: 'PROJ-1236', title: 'Fix payment gateway integration', assignee: 'Mike Johnson', status: 'blocked', priority: 'high', dueDate: '2024-01-12', project: 'Falcon' },
  { id: 'PROJ-1237', title: 'Update API documentation', assignee: 'Emily Davis', status: 'todo', priority: 'low', dueDate: '2024-01-20', project: 'Phoenix' },
  { id: 'PROJ-1238', title: 'Optimize database queries', assignee: 'David Wilson', status: 'in-progress', priority: 'medium', dueDate: '2024-01-16', project: 'Falcon' },
  { id: 'PROJ-1239', title: 'Create mobile app wireframes', assignee: 'Lisa Anderson', status: 'done', priority: 'medium', dueDate: '2024-01-14', project: 'Phoenix' },
]

const burndownData = [
  { day: 'Day 1', remaining: 100, planned: 100 },
  { day: 'Day 2', remaining: 95, planned: 95 },
  { day: 'Day 3', remaining: 88, planned: 90 },
  { day: 'Day 4', remaining: 82, planned: 85 },
  { day: 'Day 5', remaining: 75, planned: 80 },
  { day: 'Day 6', remaining: 68, planned: 75 },
  { day: 'Day 7', remaining: 60, planned: 70 },
]

const statusDistribution = [
  { status: 'Done', count: 45, color: '#10B981' },
  { status: 'In Progress', count: 32, color: '#F59E0B' },
  { status: 'To Do', count: 28, color: '#6B7280' },
  { status: 'Blocked', count: 8, color: '#EF4444' },
]

const teamPerformance = [
  { week: 'Week 1', velocity: 42, completed: 38 },
  { week: 'Week 2', velocity: 45, completed: 42 },
  { week: 'Week 3', velocity: 38, completed: 35 },
  { week: 'Week 4', velocity: 52, completed: 48 },
]

const getStatusIcon = (status: string) => {
  switch (status) {
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

const getStatusBadge = (status: string) => {
  switch (status) {
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

const getPriorityBadge = (priority: string) => {
  switch (priority) {
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

export default function JiraReportsDashboard() {
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedSprint, setSelectedSprint] = useState('current')
  const [selectedAssignee, setSelectedAssignee] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter tasks based on current selections
  const filteredTasks = mockTasks.filter(task => {
    if (selectedProject !== 'all' && task.project.toLowerCase() !== selectedProject) return false
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false
    if (selectedAssignee !== 'all' && task.assignee.toLowerCase().replace(' ', '-') !== selectedAssignee) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Jira Reports Dashboard</h1>
            <p className="text-muted-foreground mt-2">Track project progress and team performance</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-border bg-surface hover:bg-surface/80">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Jan 1 - Jan 31, 2024
            </Button>
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

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-surface border-border hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">113</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-400">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">45</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-400">+8%</span> completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Completion Time</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4.2</div>
              <p className="text-xs text-muted-foreground">
                days per task
              </p>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Team Velocity</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">48</div>
              <p className="text-xs text-muted-foreground">
                story points this sprint
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Burndown Chart */}
          <Card className="bg-surface border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Sprint Burndown Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 p-4">
                {burndownData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="flex flex-col gap-1 w-full h-48 justify-end">
                      <div 
                        className="bg-primary/30 rounded-sm w-full transition-all duration-300 hover:bg-primary/40"
                        style={{ height: `${data.planned * 1.8}px` }}
                        title={`Planned: ${data.planned}`}
                      />
                      <div 
                        className="bg-primary rounded-sm w-full transition-all duration-300 hover:bg-primary/80"
                        style={{ height: `${data.remaining * 1.8}px` }}
                        title={`Remaining: ${data.remaining}`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 text-center">{data.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-sm" />
                  <span className="text-xs text-muted-foreground">Remaining</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary/30 rounded-sm" />
                  <span className="text-xs text-muted-foreground">Planned</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Status Distribution */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <PieChart className="w-5 h-5 mr-2 text-primary" />
                Task Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusDistribution.map((item, index) => {
                  const total = statusDistribution.reduce((sum, s) => sum + s.count, 0)
                  const percentage = Math.round((item.count / total) * 100)
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{item.status}</span>
                        <span className="text-sm font-medium text-foreground">{item.count}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance Chart */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Team Performance Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-8 p-4">
              {teamPerformance.map((week, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="flex gap-2 w-full h-48 justify-center items-end">
                    <div 
                      className="bg-primary/50 rounded-sm w-6 transition-all duration-300 hover:bg-primary/70"
                      style={{ height: `${week.velocity * 3}px` }}
                      title={`Velocity: ${week.velocity}`}
                    />
                    <div 
                      className="bg-green-500 rounded-sm w-6 transition-all duration-300 hover:bg-green-400"
                      style={{ height: `${week.completed * 3}px` }}
                      title={`Completed: ${week.completed}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-2 text-center">{week.week}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/50 rounded-sm" />
                <span className="text-xs text-muted-foreground">Planned Velocity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm" />
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Filter className="w-5 h-5 mr-2 text-primary" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="phoenix">Phoenix</SelectItem>
                  <SelectItem value="falcon">Falcon</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSprint} onValueChange={setSelectedSprint}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Sprint" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="current">Current Sprint</SelectItem>
                  <SelectItem value="sprint-1">Sprint 1</SelectItem>
                  <SelectItem value="sprint-2">Sprint 2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="sarah-smith">Sarah Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
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

        {/* Recent Tasks Table */}
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
                    <TableHead className="text-muted-foreground">Assignee</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Priority</TableHead>
                    <TableHead className="text-muted-foreground">Due Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className="border-border hover:bg-muted/50">
                        <TableCell className="font-mono text-primary">{task.id}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-foreground">{task.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{task.assignee}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            {getStatusBadge(task.status)}
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell className="text-muted-foreground">{task.dueDate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
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