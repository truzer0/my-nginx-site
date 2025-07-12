"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Building2, 
  FileText, 
  BarChart3, 
  Trophy, 
  FolderOpen, 
  Star, 
  Shield, 
  BookOpen,
  Award,
  Target,
  Clock,
  Edit,
  Settings,
  Code,
  GitMerge,
  Users,
  TrendingUp
} from "lucide-react"

interface UserProfileCardProps {
  user?: {
    name: string
    jobTitle: string
    department: string
    avatar?: string
    isAdmin?: boolean
  }
  stats?: {
    articlesPublished: number
    reportsCompleted: number
    achievementsEarned: number
    projectsContributed: number
  }
  achievements?: Array<{
    id: string
    name: string
    description: string
    icon: string
    color: string
  }>
  skills?: string[]
  recentActivity?: Array<{
    id: string
    type: "article" | "report"
    title: string
    date: string
  }>
  profileCompletion?: number
  monthlyProgress?: number
  onEditProfile?: () => void
  onAdminPanel?: () => void
}

export default function UserProfileCard({
  user = {
    name: "Sarah Chen",
    jobTitle: "Senior Software Developer",
    department: "Engineering Department",
    avatar: "/avatars/sarah-chen.jpg",
    isAdmin: true
  },
  stats = {
    articlesPublished: 24,
    reportsCompleted: 18,
    achievementsEarned: 12,
    projectsContributed: 8
  },
  achievements = [
    {
      id: "1",
      name: "Code Reviewer",
      description: "Reviewed 50+ pull requests",
      icon: "code",
      color: "bg-blue-500"
    },
    {
      id: "2", 
      name: "Documentation Champion",
      description: "Created comprehensive documentation",
      icon: "book",
      color: "bg-green-500"
    },
    {
      id: "3",
      name: "Team Leader",
      description: "Led multiple successful projects",
      icon: "users",
      color: "bg-purple-500"
    },
    {
      id: "4",
      name: "Innovation Award",
      description: "Recognized for outstanding innovation",
      icon: "trophy",
      color: "bg-yellow-500"
    }
  ],
  skills = [
    "React", "TypeScript", "Node.js", "AWS", "Docker", 
    "GraphQL", "PostgreSQL", "Git", "CI/CD", "Agile"
  ],
  recentActivity = [
    {
      id: "1",
      type: "article",
      title: "Best Practices for React Performance Optimization",
      date: "2 days ago"
    },
    {
      id: "2",
      type: "report", 
      title: "Q4 Engineering Metrics Analysis",
      date: "1 week ago"
    },
    {
      id: "3",
      type: "article",
      title: "Implementing Microservices Architecture",
      date: "2 weeks ago"
    }
  ],
  profileCompletion = 85,
  monthlyProgress = 67,
  onEditProfile = () => {},
  onAdminPanel = () => {}
}: UserProfileCardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getAchievementIcon = (iconType: string) => {
    switch (iconType) {
      case "code":
        return <Code className="h-5 w-5 text-white" />
      case "book":
        return <BookOpen className="h-5 w-5 text-white" />
      case "users":
        return <Users className="h-5 w-5 text-white" />
      case "trophy":
        return <Trophy className="h-5 w-5 text-white" />
      default:
        return <Award className="h-5 w-5 text-white" />
    }
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-card border-border">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center flex-1">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div>
                    <h1 className="text-3xl font-semibold text-foreground">{user.name}</h1>
                    <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      {user.jobTitle}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4" />
                      {user.department}
                    </p>
                  </div>
                  
                  {/* Progress Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Profile Completion</span>
                        <span className="text-sm font-medium text-foreground">{profileCompletion}%</span>
                      </div>
                      <Progress value={profileCompletion} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Monthly Goals</span>
                        <span className="text-sm font-medium text-foreground">{monthlyProgress}%</span>
                      </div>
                      <Progress value={monthlyProgress} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <Button onClick={onEditProfile} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                {user.isAdmin && (
                  <Button variant="outline" onClick={onAdminPanel} className="border-border hover:bg-accent">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.articlesPublished}</p>
                  <p className="text-sm text-muted-foreground">Articles Published</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.reportsCompleted}</p>
                  <p className="text-sm text-muted-foreground">Reports Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.achievementsEarned}</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.projectsContributed}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="overview" className="text-muted-foreground data-[state=active]:text-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="articles" className="text-muted-foreground data-[state=active]:text-foreground">
              Articles
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-muted-foreground data-[state=active]:text-foreground">
              Reports
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-muted-foreground data-[state=active]:text-foreground">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Achievement Badges */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.slice(0, 4).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="group p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        title={achievement.description}
                      >
                        <div className={`inline-flex p-2 rounded-lg ${achievement.color} mb-2`}>
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <p className="text-sm font-medium text-foreground">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={activity.id}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'article' ? 'bg-primary/10' : 'bg-green-500/10'
                          }`}>
                            {activity.type === 'article' ? (
                              <FileText className={`h-4 w-4 ${
                                activity.type === 'article' ? 'text-primary' : 'text-green-500'
                              }`} />
                            ) : (
                              <BarChart3 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                        {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Published Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.filter(item => item.type === 'article').map((article, index) => (
                    <div key={article.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <h3 className="font-medium text-foreground">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{article.date}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          1.2k views
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          4.8 rating
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Completed Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.filter(item => item.type === 'report').map((report, index) => (
                    <div key={report.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <h3 className="font-medium text-foreground">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{report.date}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant="outline" className="text-green-500 border-green-500/20">
                          Completed
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Engineering Department
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">All Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-6 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${achievement.color}`}>
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                          <Badge variant="outline" className="mt-3 text-primary border-primary/20">
                            Earned
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}