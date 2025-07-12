"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Code, MessageSquare, BarChart, Users, DollarSign, ExternalLink, Filter } from "lucide-react"

const resourcesData = [
  {
    id: 1,
    title: "Jira",
    description: "Project management and issue tracking for development teams",
    category: "Development",
    icon: Code,
    isFavorite: true,
    recentlyAccessed: true
  },
  {
    id: 2,
    title: "Slack",
    description: "Team communication and collaboration platform",
    category: "Communication",
    icon: MessageSquare,
    isFavorite: false,
    recentlyAccessed: true
  },
  {
    id: 3,
    title: "Tableau",
    description: "Data visualization and business intelligence platform",
    category: "Analytics",
    icon: BarChart,
    isFavorite: true,
    recentlyAccessed: false
  },
  {
    id: 4,
    title: "BambooHR",
    description: "Human resources management and employee database",
    category: "HR",
    icon: Users,
    isFavorite: false,
    recentlyAccessed: true
  },
  {
    id: 5,
    title: "SAP Concur",
    description: "Expense management and financial reporting system",
    category: "Finance",
    icon: DollarSign,
    isFavorite: true,
    recentlyAccessed: false
  },
  {
    id: 6,
    title: "GitLab",
    description: "DevOps platform for code repository and CI/CD",
    category: "Development",
    icon: Code,
    isFavorite: false,
    recentlyAccessed: false
  },
  {
    id: 7,
    title: "Microsoft Teams",
    description: "Video conferencing and team collaboration suite",
    category: "Communication",
    icon: MessageSquare,
    isFavorite: true,
    recentlyAccessed: true
  },
  {
    id: 8,
    title: "Power BI",
    description: "Business analytics and reporting dashboard",
    category: "Analytics",
    icon: BarChart,
    isFavorite: false,
    recentlyAccessed: false
  },
  {
    id: 9,
    title: "Workday",
    description: "Enterprise resource planning for HR and finance",
    category: "HR",
    icon: Users,
    isFavorite: true,
    recentlyAccessed: true
  },
  {
    id: 10,
    title: "QuickBooks",
    description: "Accounting software for financial management",
    category: "Finance",
    icon: DollarSign,
    isFavorite: false,
    recentlyAccessed: false
  },
  {
    id: 11,
    title: "Confluence",
    description: "Document collaboration and knowledge management",
    category: "Development",
    icon: Code,
    isFavorite: true,
    recentlyAccessed: false
  },
  {
    id: 12,
    title: "Zoom",
    description: "Video conferencing and webinar platform",
    category: "Communication",
    icon: MessageSquare,
    isFavorite: false,
    recentlyAccessed: true
  }
]

const categories = ["All", "Development", "Communication", "Analytics", "HR", "Finance"]

export default function ResourceDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [favorites, setFavorites] = useState(new Set(resourcesData.filter(r => r.isFavorite).map(r => r.id)))

  const toggleFavorite = (resourceId: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(resourceId)) {
      newFavorites.delete(resourceId)
    } else {
      newFavorites.add(resourceId)
    }
    setFavorites(newFavorites)
  }

  const filteredResources = resourcesData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "All" || resource.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const totalResources = resourcesData.length
  const recentlyAccessedCount = resourcesData.filter(r => r.recentlyAccessed).length
  const favoritesCount = favorites.size

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-4xl font-semibold text-foreground">Corporate Resources</h1>
              <p className="mt-2 text-lg text-muted-foreground">Access all your corporate tools and platforms</p>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
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
                    <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Recently Accessed</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Favorites</p>
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
                <h3 className="text-xl font-semibold text-foreground mb-2">No resources found</h3>
                <p className="text-muted-foreground max-w-md">
                  No resources match your current search criteria. Try adjusting your search terms or category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResources.map((resource) => {
                  const IconComponent = resource.icon
                  const isFavorited = favorites.has(resource.id)
                  
                  return (
                    <Card
                      key={resource.id}
                      className="group relative overflow-hidden bg-card border-border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
                    >
                      <CardHeader className="relative pb-3">
                        <button
                          onClick={() => toggleFavorite(resource.id)}
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
                            <IconComponent className="h-6 w-6 text-primary" />
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
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Access
                          </Button>
                          {resource.recentlyAccessed && (
                            <Badge variant="secondary" className="ml-3 bg-muted text-muted-foreground">
                              Recent
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