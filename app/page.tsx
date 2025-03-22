"use client"

import * as React from "react"
import { GalleryVerticalEnd, LogOut, Search, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import type { NavigationCategory, SiteData } from "@/lib/types"

export default function Home() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [navigationData, setNavigationData] = React.useState<NavigationCategory[]>([])
  const [activeCategory, setActiveCategory] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoriesJson, setCategoriesJson] = React.useState("")
  const [sitesJson, setSitesJson] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch navigation data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/navigation")
        if (response.ok) {
          const data = await response.json()
          setNavigationData(data)
          if (data.length > 0) {
            setActiveCategory(data[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching navigation data:", error)
        toast({
          title: "加载失败",
          description: "无法加载导航数据",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const filteredLinks = React.useMemo(() => {
    const category = navigationData.find((cat) => cat.id === activeCategory)
    if (!category) return []

    if (!searchQuery.trim()) return category.links

    return category.links.filter(
      (link) =>
        link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [activeCategory, searchQuery, navigationData])

  const handleSaveCategories = async () => {
    if (!user) {
      toast({
        title: "未登录",
        description: "请先登录后再进行此操作",
        variant: "destructive",
      })
      return
    }

    try {
      const newCategories = JSON.parse(categoriesJson)
      if (!Array.isArray(newCategories)) {
        throw new Error("分类数据必须是数组格式")
      }

      // Validate each category has required fields
      newCategories.forEach((cat) => {
        if (!cat.id || !cat.name) {
          throw new Error("每个分类必须包含 id 和 name 字段")
        }
      })

      // Preserve links from existing categories or initialize empty array
      const updatedData = newCategories.map((newCat) => {
        const existingCat = navigationData.find((cat) => cat.id === newCat.id)
        return {
          ...newCat,
          links: existingCat ? existingCat.links : [],
        }
      })

      // Save to server
      const response = await fetch("/api/navigation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        setNavigationData(updatedData)
        toast({
          title: "成功",
          description: "分类数据已更新并永久保存",
        })
      } else {
        throw new Error("服务器保存失败")
      }
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "JSON 格式错误",
        variant: "destructive",
      })
    }
  }

  const handleSaveSites = async () => {
    if (!user) {
      toast({
        title: "未登录",
        description: "请先登录后再进行此操作",
        variant: "destructive",
      })
      return
    }

    try {
      const newSites = JSON.parse(sitesJson) as SiteData[]
      if (!Array.isArray(newSites)) {
        throw new Error("站点数据必须是数组格式")
      }

      // Validate each site has required fields
      newSites.forEach((site) => {
        if (!site.name || !site.url || !site.categoryId) {
          throw new Error("每个站点必须包含 name, url 和 categoryId 字段")
        }
      })

      // Group sites by category
      const sitesByCategory = newSites.reduce<Record<string, any[]>>((acc, site) => {
        if (!acc[site.categoryId]) {
          acc[site.categoryId] = []
        }
        acc[site.categoryId].push({
          name: site.name,
          url: site.url,
          description: site.description || "",
          logo: site.logo || "",
        })
        return acc
      }, {})

      // Update navigation data with new sites
      const updatedData = navigationData.map((category) => {
        return {
          ...category,
          links: sitesByCategory[category.id] || category.links,
        }
      })

      // Save to server
      const response = await fetch("/api/navigation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        setNavigationData(updatedData)
        toast({
          title: "成功",
          description: "站点数据已更新并永久保存",
        })
      } else {
        throw new Error("服务器保存失败")
      }
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "JSON 格式错误",
        variant: "destructive",
      })
    }
  }

  const handleOpenDialog = () => {
    if (!user) {
      toast({
        title: "未登录",
        description: "请先登录后再进行此操作",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Prepare JSON for editing
    setCategoriesJson(
      JSON.stringify(
        navigationData.map(({ id, name }) => ({ id, name })),
        null,
        2,
      ),
    )

    const allSites = navigationData.flatMap((category) =>
      category.links.map((link) => ({
        name: link.name,
        url: link.url,
        description: link.description,
        logo: link.logo || "",
        categoryId: category.id,
      })),
    )
    setSitesJson(JSON.stringify(allSites, null, 2))

    setDialogOpen(true)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "已登出",
      description: "您已成功退出登录",
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">加载中...</div>
          <div className="text-muted-foreground">正在加载导航数据</div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">导航站</span>
                    <span className="">自定义分类</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>分类</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationData.map((category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      isActive={activeCategory === category.id}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-4 flex w-full max-w-md items-center space-x-2">
            <Input
              type="search"
              placeholder="搜索网站..."
              className="h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon" className="h-10 w-10">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="ml-auto text-xl font-bold">
            {navigationData.find((cat) => cat.id === activeCategory)?.name || "导航"}
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-medium">{user.username}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleOpenDialog}>自定义 JSON</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login">登录</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>自定义导航数据</DialogTitle>
                <DialogDescription>编辑分类和站点的 JSON 数据来自定义您的导航站</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="categories" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="categories">分类 JSON</TabsTrigger>
                  <TabsTrigger value="sites">站点 JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="categories" className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    分类格式: [{"{"} id: "唯一标识", name: "分类名称" {"}"}]
                  </div>
                  <Textarea
                    value={categoriesJson}
                    onChange={(e) => setCategoriesJson(e.target.value)}
                    className="font-mono h-[300px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveCategories}>保存分类</Button>
                  </div>
                </TabsContent>
                <TabsContent value="sites" className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    站点格式: [{"{"} name: "站点名称", url: "网址", description: "描述", logo: "图标URL", categoryId:
                    "所属分类ID" {"}"}]
                  </div>
                  <Textarea
                    value={sitesJson}
                    onChange={(e) => setSitesJson(e.target.value)}
                    className="font-mono h-[300px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveSites}>保存站点</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </header>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col rounded-lg border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center rounded-t-lg bg-muted p-4">
                  {link.logo ? (
                    <Image
                      src={link.logo || "/placeholder.svg"}
                      alt={`${link.name} logo`}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <Image
                      src={`/placeholder.svg?height=80&width=80&text=${link.name}`}
                      alt={`${link.name} logo`}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-2 text-lg font-medium">{link.name}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

