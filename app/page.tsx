"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ExternalLink, Github, Star, LinkIcon } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Project {
  id: number
  title: string
  description: string
  category: string
  technologies: string[]
  image: string
  demoUrl: string
  githubUrl: string
  date: string
  featured: boolean
}

interface Category {
  id: string
  label: string
  description: string
  icon: string
}

interface Link {
  id: number
  name: string
  description: string
  url: string
  category: string
}

interface SocialLink {
  name: string
  url: string
  icon: string
}

interface SiteConfig {
  title: string
  description: string
  favicon: string
  logo: string
  author: string
  copyright: string
  keywords: string[]
  themeColor: string
  socialLinks: SocialLink[]
}

interface ProjectsData {
  projects: Project[]
}

interface CategoriesData {
  categories: Category[]
}

interface LinksData {
  links: Link[]
}

interface SiteConfigData {
  site: SiteConfig
}

// 默认数据，以防JSON加载失败
const defaultProjects: Project[] = [
  {
    id: 1,
    title: "示例项目",
    description: "这是一个示例项目，当JSON数据加载失败时显示。",
    category: "web",
    technologies: ["React", "Next.js"],
    image: "/placeholder.svg?height=300&width=400",
    demoUrl: "#",
    githubUrl: "#",
    date: "2024-01-01",
    featured: true,
  },
]

const defaultCategories: Category[] = [
  {
    id: "all",
    label: "全部",
    description: "显示所有项目",
    icon: "grid",
  },
  {
    id: "web",
    label: "Web应用",
    description: "基于浏览器的网页应用程序",
    icon: "globe",
  },
]

const defaultLinks: Link[] = [
  {
    id: 1,
    name: "GitHub",
    description: "代码托管平台",
    url: "https://github.com",
    category: "开发工具",
  },
]

const defaultSiteConfig: SiteConfig = {
  title: "我的作品集",
  description: "展示我的技术项目和创意作品",
  favicon: "/favicon.ico",
  logo: "/logo.png",
  author: "开发者",
  copyright: "© 2024 我的作品集. 保留所有权利.",
  keywords: ["作品集", "项目展示"],
  themeColor: "#3b82f6",
  socialLinks: [],
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeLinkCategory, setActiveLinkCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 加载项目数据、分类数据和友情链接数据
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("开始加载JSON数据...")

        // 并行加载所有JSON文件
        const [projectsResponse, categoriesResponse, linksResponse, siteConfigResponse] = await Promise.all([
          fetch("/data/projects.json"),
          fetch("/data/categories.json"),
          fetch("/data/links.json"),
          fetch("/data/site-config.json"),
        ])

        console.log("项目数据响应状态:", projectsResponse.status)
        console.log("分类数据响应状态:", categoriesResponse.status)
        console.log("友情链接响应状态:", linksResponse.status)
        console.log("网站配置响应状态:", siteConfigResponse.status)

        if (!projectsResponse.ok) {
          throw new Error(`项目数据加载失败: ${projectsResponse.status}`)
        }

        if (!categoriesResponse.ok) {
          throw new Error(`分类数据加载失败: ${categoriesResponse.status}`)
        }

        if (!linksResponse.ok) {
          throw new Error(`友情链接加载失败: ${linksResponse.status}`)
        }

        if (!siteConfigResponse.ok) {
          throw new Error(`网站配置加载失败: ${siteConfigResponse.status}`)
        }

        const projectsData: ProjectsData = await projectsResponse.json()
        const categoriesData: CategoriesData = await categoriesResponse.json()
        const linksData: LinksData = await linksResponse.json()
        const siteConfigData: SiteConfigData = await siteConfigResponse.json()

        console.log(
          "数据加载成功:",
          projectsData.projects.length,
          "个项目,",
          categoriesData.categories.length,
          "个分类,",
          linksData.links.length,
          "个友情链接",
        )

        setProjects(projectsData.projects)
        setCategories(categoriesData.categories)
        setLinks(linksData.links)
        setSiteConfig(siteConfigData.site)

        // 确保精选项目排序正确
        const sortedProjects = [...projectsData.projects].sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })

        setFilteredProjects(sortedProjects)
        setFilteredLinks(linksData.links)
      } catch (error) {
        console.error("数据加载错误:", error)
        setError(`数据加载失败: ${error instanceof Error ? error.message : "未知错误"}`)

        // 使用默认数据
        setProjects(defaultProjects)
        setCategories(defaultCategories)
        setLinks(defaultLinks)
        setSiteConfig(defaultSiteConfig)
        setFilteredProjects(defaultProjects)
        setFilteredLinks(defaultLinks)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    // 过滤项目
    let filtered = [...projects] // 创建副本以避免修改原始数据

    if (activeCategory !== "all") {
      filtered = filtered.filter((project) => project.category === activeCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // 将精选项目排在前面 - 确保排序正确执行
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })

    console.log(
      "排序后的项目:",
      filtered.map((p) => `${p.title} (featured: ${p.featured})`),
    )

    setFilteredProjects(filtered)
  }, [projects, activeCategory, searchTerm])

  useEffect(() => {
    // 过滤友情链接
    let filtered = links

    if (activeLinkCategory !== "all") {
      filtered = filtered.filter((link) => link.category === activeLinkCategory)
    }

    setFilteredLinks(filtered)
  }, [links, activeLinkCategory])

  // 计算每个分类的项目数量
  const categoriesWithCount = categories.map((category) => ({
    ...category,
    count: category.id === "all" ? projects.length : projects.filter((p) => p.category === category.id).length,
  }))

  // 获取友情链接的所有分类
  const linkCategories = ["all", ...Array.from(new Set(links.map((link) => link.category)))]
  const linkCategoriesWithCount = linkCategories.map((category) => ({
    id: category,
    label: category === "all" ? "全部" : category,
    count: category === "all" ? links.length : links.filter((l) => l.category === category).length,
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>加载错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="w-full mb-8">
          {/* Projects Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {activeCategory === "all"
                  ? "所有项目"
                  : categoriesWithCount.find((c) => c.id === activeCategory)?.label}
              </h2>
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesWithCount.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">没有找到匹配的项目</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer with Links */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">友情链接</h2>
              </div>
              <Select value={activeLinkCategory} onValueChange={setActiveLinkCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {linkCategoriesWithCount.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredLinks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">没有找到匹配的友情链接</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredLinks.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>{siteConfig.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 ${
        project.featured ? "ring-2 ring-yellow-500/20" : ""
      }`}
    >
      <div className="relative overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {project.featured && (
          <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-900">
            <Star className="h-3 w-3 mr-1" />
            精选
          </Badge>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">{project.title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {project.date}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                演示
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                代码
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LinkCard({ link }: { link: Link }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden">
        <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <LinkIcon className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-xs font-medium text-primary">{link.category}</p>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base group-hover:text-primary transition-colors">{link.name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {link.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">{link.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-3">
          {/* Category Badge */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {link.category}
            </Badge>
          </div>

          {/* Action Button */}
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1 h-8 text-xs">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                访问链接
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
