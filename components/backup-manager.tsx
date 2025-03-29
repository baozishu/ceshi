"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileJson,
  Database,
  ArrowRight,
  Loader2,
  ExternalLink,
  Calendar,
  Clock,
  RefreshCw,
  HardDrive,
  FileText,
  Trash2,
  Image,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useDomains } from "@/contexts/domain-context"
import { useSite } from "@/contexts/site-context"
import { useAuth } from "@/contexts/auth-context"

// 备份数据类型
interface BackupData {
  version: string
  timestamp: number
  registrarIcons: Record<string, string>
  domains: any[]
  soldDomains: any[]
  friendlyLinks: any[]
  siteSettings: any
  auth: {
    passwordHash: string
  }
}

// 备份历史记录类型
interface BackupHistory {
  filename: string
  timestamp: number
  size: number
  items: {
    domains: number
    soldDomains: number
    friendlyLinks: number
    registrarIcons: number
  }
}

// 当前备份版本
const BACKUP_VERSION = "1.0.0"

export default function BackupManager() {
  const { domains, soldDomains, friendlyLinks, updateDomains, updateSoldDomains, updateFriendlyLinks } = useDomains()
  const { settings, updateSiteName, updateLogoType, updateLogoImage, updateLogoText, updateFavicon } = useSite()
  const { updatePassword } = useAuth()

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [importProgress, setImportProgress] = useState(0)
  const [backupStats, setBackupStats] = useState<{
    lastBackup: string | null
    domainsCount: number
    soldDomainsCount: number
    friendlyLinksCount: number
    registrarIconsCount: number
  }>({
    lastBackup: null,
    domainsCount: 0,
    soldDomainsCount: 0,
    friendlyLinksCount: 0,
    registrarIconsCount: 0,
  })
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([])
  const [backupOptions, setBackupOptions] = useState({
    includeDomains: true,
    includeSoldDomains: true,
    includeFriendlyLinks: true,
    includeRegistrarIcons: true,
    includeSiteSettings: true,
    includePassword: true,
  })
  const [backupName, setBackupName] = useState("")
  const [showBackupDetails, setShowBackupDetails] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<BackupHistory | null>(null)

  // 用于存储定时器ID，以便在组件卸载时清除
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 组件卸载时清除所有定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  // 加载备份统计信息
  useEffect(() => {
    loadBackupStats()
    loadBackupHistory()
  }, [])

  // 加载备份统计信息
  const loadBackupStats = () => {
    try {
      // 获取上次备份时间
      const lastBackupStr = localStorage.getItem("domain-display-last-backup")
      const lastBackup = lastBackupStr ? new Date(Number.parseInt(lastBackupStr)).toLocaleString() : null

      setBackupStats({
        lastBackup,
        domainsCount: domains.length,
        soldDomainsCount: soldDomains.length,
        friendlyLinksCount: friendlyLinks.length,
        registrarIconsCount: Object.keys(settings.registrarIcons || {}).length,
      })

      // 设置默认备份名称
      const date = new Date()
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")}`
      setBackupName(`domain-backup-${formattedDate}`)
    } catch (error) {
      console.error("加载备份统计信息失败:", error)
    }
  }

  // 加载备份历史
  const loadBackupHistory = () => {
    try {
      // 模拟从本地存储加载备份历史
      // 在实际应用中，这应该从服务器或本地存储加载
      const mockHistory: BackupHistory[] = [
        {
          filename: "backup-2023-05-15.json",
          timestamp: new Date("2023-05-15").getTime(),
          size: 24500,
          items: {
            domains: 5,
            soldDomains: 3,
            friendlyLinks: 5,
            registrarIcons: 5,
          },
        },
        {
          filename: "backup-2023-06-20.json",
          timestamp: new Date("2023-06-20").getTime(),
          size: 26800,
          items: {
            domains: 6,
            soldDomains: 3,
            friendlyLinks: 6,
            registrarIcons: 5,
          },
        },
        {
          filename: "backup-2023-07-10.json",
          timestamp: new Date("2023-07-10").getTime(),
          size: 28200,
          items: {
            domains: 7,
            soldDomains: 4,
            friendlyLinks: 6,
            registrarIcons: 6,
          },
        },
      ]

      setBackupHistory(mockHistory)
    } catch (error) {
      console.error("加载备份历史失败:", error)
    }
  }

  // 创建备份
  const createBackup = async (): Promise<BackupData> => {
    // 从API获取备份数据
    const response = await fetch("/api/backup")
    if (!response.ok) {
      throw new Error("Failed to create backup")
    }

    const backupData = await response.json()

    // 根据选项过滤数据
    if (!backupOptions.includeDomains) {
      backupData.domains = []
    }

    if (!backupOptions.includeSoldDomains) {
      backupData.soldDomains = []
    }

    if (!backupOptions.includeFriendlyLinks) {
      backupData.friendlyLinks = []
    }

    if (!backupOptions.includeRegistrarIcons) {
      backupData.registrarIcons = {}
    }

    if (!backupOptions.includeSiteSettings) {
      backupData.siteSettings = null
    }

    if (!backupOptions.includePassword) {
      backupData.auth = { passwordHash: "" }
    }

    return backupData
  }

  // 验证备份数据
  const validateBackup = (data: any): boolean => {
    // 检查基本结构
    if (!data || typeof data !== "object") return false
    if (!data.version || !data.timestamp) return false

    // 检查数据结构
    if (!Array.isArray(data.domains)) return false
    if (!Array.isArray(data.soldDomains)) return false
    if (!Array.isArray(data.friendlyLinks)) return false
    if (!data.registrarIcons || typeof data.registrarIcons !== "object") return false
    if (!data.siteSettings || typeof data.siteSettings !== "object") return false
    if (!data.auth || typeof data.auth !== "object") return false

    return true
  }

  // 处理导出备份
  const handleExport = async () => {
    try {
      setIsExporting(true)
      setExportProgress(0)

      // 模拟进度
      const interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 50)

      // 创建备份数据
      const backup = await createBackup()

      // 转换为JSON字符串
      const backupJson = JSON.stringify(backup, null, 2)

      // 创建Blob对象
      const blob = new Blob([backupJson], { type: "application/json" })

      // 创建下载链接
      const url = URL.createObjectURL(blob)

      // 使用更安全的方式创建和触发下载
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url

      // 设置文件名
      a.download = `${backupName || "domain-backup"}.json`

      // 触发下载
      document.body.appendChild(a)
      a.click()

      // 延迟清理，确保下载已开始
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // 保存最后备份时间
        localStorage.setItem("domain-display-last-backup", Date.now().toString())

        // 更新统计信息
        loadBackupStats()

        // 更新备份历史
        const newBackup: BackupHistory = {
          filename: `${backupName || "domain-backup"}.json`,
          timestamp: Date.now(),
          size: new Blob([backupJson]).size,
          items: {
            domains: backupOptions.includeDomains ? domains.length : 0,
            soldDomains: backupOptions.includeSoldDomains ? soldDomains.length : 0,
            friendlyLinks: backupOptions.includeFriendlyLinks ? friendlyLinks.length : 0,
            registrarIcons: backupOptions.includeRegistrarIcons ? Object.keys(settings.registrarIcons || {}).length : 0,
          },
        }
        setBackupHistory([newBackup, ...backupHistory])

        // 完成进度
        clearInterval(interval)
        setExportProgress(100)

        setTimeout(() => {
          setIsExporting(false)
          setMessage({ type: "success", text: "备份已成功导出" })

          // 3秒后清除消息
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          timeoutRef.current = setTimeout(() => {
            setMessage(null)
          }, 3000)
        }, 500)
      }, 500)
    } catch (error) {
      console.error("导出备份失败:", error)
      setIsExporting(false)
      setMessage({ type: "error", text: "导出备份失败" })
    }
  }

  // 导入备份
  const importBackup = async (backupJson: string): Promise<boolean> => {
    if (!backupJson || typeof backupJson !== "string") {
      return false
    }

    try {
      setImportProgress(0)

      // 模拟进度
      const interval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 50)

      // 解析JSON
      const backup = JSON.parse(backupJson)

      // 验证备份数据
      if (!validateBackup(backup)) {
        clearInterval(interval)
        return false
      }

      // 导入数据到API
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: backupJson,
      })

      if (!response.ok) {
        clearInterval(interval)
        return false
      }

      // 更新本地状态
      if (backup.domains && backup.domains.length > 0) {
        updateDomains(backup.domains)
      }

      if (backup.soldDomains && backup.soldDomains.length > 0) {
        updateSoldDomains(backup.soldDomains)
      }

      if (backup.friendlyLinks && backup.friendlyLinks.length > 0) {
        updateFriendlyLinks(backup.friendlyLinks)
      }

      if (backup.siteSettings) {
        updateSiteName(backup.siteSettings.siteName)
        updateLogoType(backup.siteSettings.logoType)
        updateLogoImage(backup.siteSettings.logoImage || "")
        updateLogoText(backup.siteSettings.logoText || "")
        updateFavicon(backup.siteSettings.favicon)
      }

      // 保存最后备份时间
      localStorage.setItem("domain-display-last-backup", Date.now().toString())

      // 更新统计信息
      loadBackupStats()

      // 完成进度
      clearInterval(interval)
      setImportProgress(100)

      // 延迟返回结果
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    } catch (error) {
      console.error("导入备份失败:", error)
      return false
    }
  }

  // 处理导入备份
  const handleImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    setShowImportConfirm(false)

    try {
      // 读取文件内容
      const content = await importFile.text()

      if (!content) {
        setMessage({ type: "error", text: "读取文件失败：文件内容为空" })
        setIsImporting(false)
        return
      }

      const success = await importBackup(content)

      if (success) {
        setMessage({ type: "success", text: "备份已成功导入，页面将在3秒后刷新" })

        // 3秒后刷新页面以应用导入的数据
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          window.location.href = window.location.href
        }, 3000)
      } else {
        setMessage({ type: "error", text: "导入备份失败：无效的备份文件" })
        setIsImporting(false)
      }
    } catch (error) {
      setMessage({ type: "error", text: "导入备份失败：文件格式错误" })
      setIsImporting(false)
    }
  }

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setMessage({ type: "error", text: "请选择有效的JSON备份文件" })
      return
    }

    setImportFile(file)
    setShowImportConfirm(true)

    // 重置文件输入，以便可以选择同一个文件
    if (event.target) {
      event.target.value = ""
    }
  }

  // 触发文件选择对话框
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 格式化时间
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 查看备份详情
  const viewBackupDetails = (backup: BackupHistory) => {
    setSelectedBackup(backup)
    setShowBackupDetails(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">备份管理</h1>
        <Button variant="outline" size="sm" onClick={loadBackupStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          刷新
        </Button>
      </div>

      {message && (
        <Alert
          variant={message.type === "error" ? "destructive" : undefined}
          className={message.type === "success" ? "bg-green-50 border-green-200" : undefined}
        >
          {message.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-600" : undefined}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">备份概览</TabsTrigger>
          <TabsTrigger value="actions">备份操作</TabsTrigger>
          <TabsTrigger value="history">备份历史</TabsTrigger>
        </TabsList>

        {/* 备份概览 */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>备份概览</CardTitle>
              <CardDescription>查看您的数据备份状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Database className="h-8 w-8 text-primary mb-2" />
                      <h3 className="text-2xl font-bold">{backupStats.domainsCount}</h3>
                      <p className="text-sm text-muted-foreground">待售域名</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                      <h3 className="text-2xl font-bold">{backupStats.soldDomainsCount}</h3>
                      <p className="text-sm text-muted-foreground">已售域名</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <ExternalLink className="h-8 w-8 text-blue-500 mb-2" />
                      <h3 className="text-2xl font-bold">{backupStats.friendlyLinksCount}</h3>
                      <p className="text-sm text-muted-foreground">友情链接</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Image className="h-8 w-8 text-amber-500 mb-2" />
                      <h3 className="text-2xl font-bold">{backupStats.registrarIconsCount}</h3>
                      <p className="text-sm text-muted-foreground">注册商图标</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>备份状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">上次备份时间</span>
                      <span className="text-sm text-muted-foreground">{backupStats.lastBackup || "从未备份"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">备份版本</span>
                      <span className="text-sm text-muted-foreground">v{BACKUP_VERSION}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">总数据项</span>
                      <span className="text-sm text-muted-foreground">
                        {backupStats.domainsCount +
                          backupStats.soldDomainsCount +
                          backupStats.friendlyLinksCount +
                          backupStats.registrarIconsCount}{" "}
                        项
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
            <CardFooter>
              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                立即备份
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 备份操作 */}
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>备份操作</CardTitle>
              <CardDescription>导出或导入您的数据备份</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <FileJson className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">导出备份</CardTitle>
                    </div>
                    <CardDescription>将您的所有数据导出为JSON文件</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="backup-name">备份文件名</Label>
                        <Input
                          id="backup-name"
                          value={backupName}
                          onChange={(e) => setBackupName(e.target.value)}
                          placeholder="输入备份文件名"
                        />
                        <p className="text-xs text-muted-foreground">文件将以 .json 格式保存</p>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">备份内容选项</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-domains"
                              checked={backupOptions.includeDomains}
                              onCheckedChange={(checked) =>
                                setBackupOptions((prev) => ({ ...prev, includeDomains: checked }))
                              }
                            />
                            <Label htmlFor="include-domains">待售域名</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-sold-domains"
                              checked={backupOptions.includeSoldDomains}
                              onCheckedChange={(checked) =>
                                setBackupOptions((prev) => ({ ...prev, includeSoldDomains: checked }))
                              }
                            />
                            <Label htmlFor="include-sold-domains">已售域名</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-friendly-links"
                              checked={backupOptions.includeFriendlyLinks}
                              onCheckedChange={(checked) =>
                                setBackupOptions((prev) => ({ ...prev, includeFriendlyLinks: checked }))
                              }
                            />
                            <Label htmlFor="include-friendly-links">友情链接</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-registrar-icons"
                              checked={backupOptions.includeRegistrarIcons}
                              onCheckedChange={(checked) =>
                                setBackupOptions((prev) => ({ ...prev, includeRegistrarIcons: checked }))
                              }
                            />
                            <Label htmlFor="include-registrar-icons">注册商图标</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-site-settings"
                              checked={backupOptions.includeSiteSettings}
                              onCheckedChange={(checked) =>
                                setBackupOptions((prev) => ({ ...prev, includeSiteSettings: checked }))
                              }
                            />
                            <Label htmlFor="include-site-settings">网站设置</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-password"
                              checked={backupOptions.includePassword}
                              onCheckedChange={(checked) =>
                                setBackupOptions((prev) => ({ ...prev, includePassword: checked }))
                              }
                            />
                            <Label htmlFor="include-password">密码（哈希值）</Label>
                          </div>
                        </div>
                      </div>

                      {isExporting && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>导出进度</span>
                            <span>{exportProgress}%</span>
                          </div>
                          <Progress value={exportProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleExport} className="w-full" disabled={isExporting}>
                      {isExporting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          导出中...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          导出备份
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Upload className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">导入备份</CardTitle>
                    </div>
                    <CardDescription>从之前导出的JSON文件中恢复您的数据</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>支持格式：</span>
                        <span className="text-muted-foreground">JSON 备份文件</span>
                      </div>

                      <div
                        className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <HardDrive className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">点击或拖放文件到此处</p>
                        <p className="text-xs text-muted-foreground">支持 .json 格式的备份文件</p>
                      </div>

                      {isImporting && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>导入进度</span>
                            <span>{importProgress}%</span>
                          </div>
                          <Progress value={importProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={triggerFileInput} className="w-full" disabled={isImporting}>
                      {isImporting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          导入中...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          选择备份文件
                        </>
                      )}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".json,application/json"
                      className="hidden"
                    />
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <p className="text-xs text-muted-foreground">
                备份文件包含您的所有数据，包括管理员密码的哈希值。请妥善保管您的备份文件。
              </p>
              <p className="text-xs text-muted-foreground">
                导入备份将覆盖当前的所有数据，请确保您已经备份了当前数据。
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 备份历史 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>备份历史</CardTitle>
              <CardDescription>查看和管理您的备份历史记录</CardDescription>
            </CardHeader>
            <CardContent>
              {backupHistory.length > 0 ? (
                <div className="space-y-4">
                  {backupHistory.map((backup, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-4 border-b">
                          <div className="flex items-center">
                            <FileJson className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm font-medium">{backup.filename}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {formatFileSize(backup.size)}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(backup.timestamp)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(backup.timestamp)}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary" className="text-xs">
                              域名: {backup.items.domains}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              已售: {backup.items.soldDomains}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              友链: {backup.items.friendlyLinks}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              图标: {backup.items.registrarIcons}
                            </Badge>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => viewBackupDetails(backup)}>
                              查看详情
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              下载
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">暂无备份历史记录</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 导入确认对话框 */}
      <Dialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认导入备份</DialogTitle>
            <DialogDescription>导入备份将覆盖当前的所有数据，此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">文件信息</h4>
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>文件名：</span>
                  <span className="font-medium">{importFile?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>大小：</span>
                  <span>{importFile ? formatFileSize(importFile.size) : "未知"}</span>
                </div>
              </div>
            </div>
            <Alert variant="destructive" className="bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>此操作将覆盖您当前的所有数据，包括域名、设置和密码。</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportConfirm(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleImport}>
              <ArrowRight className="h-4 w-4 mr-2" />
              确认导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 备份详情对话框 */}
      <Dialog open={showBackupDetails} onOpenChange={setShowBackupDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>备份详情</DialogTitle>
            <DialogDescription>查看备份文件的详细信息</DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">基本信息</h4>
                  <div className="rounded-md bg-muted p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">文件名：</span>
                      <span className="text-sm font-medium">{selectedBackup.filename}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">���小：</span>
                      <span className="text-sm">{formatFileSize(selectedBackup.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">创建日期：</span>
                      <span className="text-sm">{formatDate(selectedBackup.timestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">创建时间：</span>
                      <span className="text-sm">{formatTime(selectedBackup.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">内容统计</h4>
                  <div className="rounded-md bg-muted p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">待售域名：</span>
                      <span className="text-sm font-medium">{selectedBackup.items.domains} 个</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">已售域名：</span>
                      <span className="text-sm font-medium">{selectedBackup.items.soldDomains} 个</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">友情链接：</span>
                      <span className="text-sm font-medium">{selectedBackup.items.friendlyLinks} 个</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">注册商图标：</span>
                      <span className="text-sm font-medium">{selectedBackup.items.registrarIcons} 个</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">备份内容预览</h4>
                <div className="rounded-md bg-muted p-4 max-h-60 overflow-y-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {`{
  "version": "1.0.0",
  "timestamp": ${selectedBackup.timestamp},
  "domains": [ ... ${selectedBackup.items.domains} items ... ],
  "soldDomains": [ ... ${selectedBackup.items.soldDomains} items ... ],
  "friendlyLinks": [ ... ${selectedBackup.items.friendlyLinks} items ... ],
  "registrarIcons": { ... ${selectedBackup.items.registrarIcons} items ... },
  "siteSettings": { ... },
  "auth": {
    "passwordHash": "********"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackupDetails(false)}>
              关闭
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              下载此备份
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

