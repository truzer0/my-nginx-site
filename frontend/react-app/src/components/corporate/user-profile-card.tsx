// frontend/react-app/src/components/corporate/user-profile-card.tsx
"use client"

import { useState, useEffect } from "react"
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
    id: string;
    name: string
    username: string;
    jobTitle: string
    department: string
    avatar?: string
    isAdmin?: boolean
    profileCompletion?: number
    monthlyProgress?: number
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
  onEditProfile?: () => void
  onAdminPanel?: () => void
}

export default function UserProfileCard({
  user = {
    id: "",
    name: "Загрузка...",
    username: "",
    jobTitle: "",
    department: "",
    avatar: "",
    isAdmin: false,
    profileCompletion: 0,
    monthlyProgress: 0
  },
  stats = {
    articlesPublished: 0,
    reportsCompleted: 0,
    achievementsEarned: 0,
    projectsContributed: 0
  },
  achievements = [],
  skills = [],
  recentActivity = [],
  onEditProfile = () => {},
  onAdminPanel = () => {}
}: UserProfileCardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState(user)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          window.location.href = '/login'
          return
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Ошибка загрузки профиля')
        const data = await response.json()

        setProfileData({
          ...profileData,
          name: data.name || "Пользователь",
          username: data.username || "",
          avatar: data.profile_image ? `/uploads/${data.profile_image}` : "/uploads/default-avatar.jpg",
          isAdmin: data.role === 'admin'
        })

        // Загрузка дополнительных данных
        const statsResponse = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setProfileData(prev => ({
            ...prev,
            profileCompletion: statsData.profileCompletion || 0,
            monthlyProgress: statsData.monthlyProgress || 0
          }))
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error)
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          <p className="text-muted-foreground text-sm">Загрузка профиля...</p>
        </div>
      </div>
    )
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
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div>
                    <h1 className="text-3xl font-semibold text-foreground">{profileData.name}</h1>
                    <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      {profileData.username}
                    </p>
                    <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4" />
                      {profileData.department || "Отдел не указан"}
                    </p>
                  </div>

                  {/* Progress Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Заполнение профиля</span>
                        <span className="text-sm font-medium text-foreground">{profileData.profileCompletion}%</span>
                      </div>
                      <Progress value={profileData.profileCompletion} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Ежемесячные цели</span>
                        <span className="text-sm font-medium text-foreground">{profileData.monthlyProgress}%</span>
                      </div>
                      <Progress value={profileData.monthlyProgress} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <Button onClick={onEditProfile} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
                {profileData.isAdmin && (
                  <Button variant="outline" onClick={onAdminPanel} className="border-border hover:bg-accent">
                    <Settings className="h-4 w-4 mr-2" />
                    Админ-панель
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
                  <p className="text-sm text-muted-foreground">Статьи</p>
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
                  <p className="text-sm text-muted-foreground">Отчеты</p>
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
                  <p className="text-sm text-muted-foreground">Достижения</p>
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
                  <p className="text-sm text-muted-foreground">Проекты</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">      
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="overview" className="text-muted-foreground data-[state=active]:text-foreground">
              Обзор
            </TabsTrigger>
            <TabsTrigger value="articles" className="text-muted-foreground data-[state=active]:text-foreground">
              Статьи
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-muted-foreground data-[state=active]:text-foreground">
              Отчеты
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-muted-foreground data-[state=active]:text-foreground">
              Достижения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Achievement Badges */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">        
                    <Star className="h-5 w-5 text-primary" />
                    Последние достижения
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
                    Последние действия
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
                  Навыки и экспертиза
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
                <CardTitle className="text-foreground">Опубликованные статьи</CardTitle>    
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
                          1.2k просмотров
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          4.8 рейтинг
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
                <CardTitle className="text-foreground">Завершенные отчеты</CardTitle>     
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.filter(item => item.type === 'report').map((report, index) => (
                    <div key={report.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <h3 className="font-medium text-foreground">{report.title}</h3>    
                      <p className="text-sm text-muted-foreground mt-1">{report.date}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant="outline" className="text-green-500 border-green-500/20">
                          Завершено
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {profileData.department || "Отдел не указан"}
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
                <CardTitle className="text-foreground">Все достижения</CardTitle>      
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className={`inline-flex p-3 rounded-lg ${achievement.color} mb-3`}>
                        {getAchievementIcon(achievement.icon)}
                      </div>
                      <h3 className="text-lg font-medium text-foreground">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <div className="mt-3">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Получено
                        </Badge>
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
