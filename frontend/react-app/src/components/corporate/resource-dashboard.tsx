"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Star, ExternalLink, Filter } from "lucide-react"
import { getLinks } from "@/lib/api"
import { ApiErrorHandler } from "@/components/api-error-handler"
import { Skeleton } from "@/components/ui/skeleton"

interface Resource {
  id: number
  url: string
  button_text?: string
  title: string
  description: string
  category: string
  is_favorite: boolean
  last_accessed: string | null
}

export default function ResourceDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [categories, setCategories] = useState<string[]>(["All"])

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getLinks()
        // Преобразование данных к нужному формату
        const transformedData = data.map(link => ({
          ...link,
          title: link.button_text || 'Новый ресурс',
          description: '',
          category: 'Общее',
          is_favorite: false, // Начальное значение
          last_accessed: null
        }))
        setResources(transformedData)
        
        const uniqueCategories = Array.from(
          new Set(transformedData.map(r => r.category))
        )
        setCategories(["All", ...uniqueCategories])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const handleToggleFavorite = (resourceId: number) => {
    setResources(resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, is_favorite: !resource.is_favorite } 
        : resource
    ))
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "All" || resource.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const totalResources = resources.length
  const recentlyAccessedCount = resources.filter(r => r.last_accessed).length
  const favoritesCount = resources.filter(r => r.is_favorite).length

  if (error) return <ApiErrorHandler error={error} />
  if (loading) return <ResourceDashboardSkeleton />

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-4xl font-semibold text-foreground">Корпоративные ресурсы</h1>
              <p className="mt-2 text-lg text-muted-foreground">Доступ ко всем корпоративным инструментам</p>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск ресурсов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Всего ресурсов</p>
                    <p className="text-2xl font-bold text-foreground">{totalResources}</p>
                  </div>
                  <Filter className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Недавно использовались</p>
                    <p className="text-2xl font-bold text-foreground">{recentlyAccessedCount}</p>
                  </div>
                  <ExternalLink className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Избранные</p>
                    <p className="text-2xl font-bold text-foreground">{favoritesCount}</p>
                  </div>
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-card border-border">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground transition-colors"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            {filteredResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ресурсы не найдены</h3>
                <p className="text-muted-foreground max-w-md">
                  Нет ресурсов, соответствующих вашим критериям поиска. Попробуйте изменить параметры поиска.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResources.map((resource) => {
                  const isFavorited = resource.is_favorite
                  const isRecent = resource.last_accessed && 
                    new Date(resource.last_accessed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  
                  return (
                    <Card
                      key={resource.id}
                      className="group relative overflow-hidden bg-card border-border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
                    >
                      <CardHeader className="relative pb-3">
                        <button
                          onClick={() => handleToggleFavorite(resource.id)}
                          className="absolute right-4 top-4 z-10 rounded-full p-1 transition-colors hover:bg-muted"
                        >
                          <Star
                            className={`h-4 w-4 transition-colors ${
                              isFavorited
                                ? "fill-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          />
                        </button>
                        <div className="flex items-center space-x-3">
                          <div className="rounded-lg bg-primary/10 p-3">
                            <ExternalLink className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-foreground">
                              {resource.title}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1 border-border text-muted-foreground">
                              {resource.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Button 
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            asChild
                          >
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Открыть
                            </a>
                          </Button>
                          {isRecent && (
                            <Badge variant="secondary" className="ml-3 bg-muted text-muted-foreground">
                              Недавно
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ResourceDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-80" />
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          
          {/* Resources Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
