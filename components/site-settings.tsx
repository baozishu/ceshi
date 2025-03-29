"use client"

import { useState, useEffect } from "react"
import { useSite } from "@/contexts/site-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, RefreshCw, Globe, Image, Type, Eye, EyeOff, Save, Undo2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SiteSettings() {
  const { settings, updateSiteName, updateLogoType, updateLogoImage, updateLogoText, updateFavicon, resetSettings } =
    useSite()

  // 表单状态
  const [siteName, setSiteName] = useState(settings.siteName)
  const [logoType, setLogoType] = useState<"text" | "image">(settings.logoType)
  const [logoImage, setLogoImage] = useState(settings.logoImage || "")
  const [logoText, setLogoText] = useState(settings.logoText || "")
  const [favicon, setFavicon] = useState(settings.favicon)

  // UI状态
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 当设置变化时更新表单
  useEffect(() => {
    setSiteName(settings.siteName)
    setLogoType(settings.logoType)
    setLogoImage(settings.logoImage || "")
    setLogoText(settings.logoText || "")
    setFavicon(settings.favicon)
    setHasChanges(false)
  }, [settings])

  // 检测表单变化
  useEffect(() => {
    const hasFormChanges =
      siteName !== settings.siteName ||
      logoType !== settings.logoType ||
      logoImage !== (settings.logoImage || "") ||
      logoText !== (settings.logoText || "") ||
      favicon !== settings.favicon

    setHasChanges(hasFormChanges)
  }, [siteName, logoType, logoImage, logoText, favicon, settings])

  // 显示消息后自动清除
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // 保存所有设置
  const handleSaveAll = async () => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      // 更新所有设置
      await updateSiteName(siteName)
      await updateLogoType(logoType)

      if (logoType === "image") {
        await updateLogoImage(logoImage)
      } else {
        await updateLogoText(logoText)
      }

      await updateFavicon(favicon)

      setMessage({ type: "success", text: "所有设置已成功保存" })
      setHasChanges(false)
    } catch (error) {
      console.error("保存设置失败:", error)
      setMessage({ type: "error", text: "保存设置失败，请重试" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 重置表单到当前设置
  const handleResetForm = () => {
    setSiteName(settings.siteName)
    setLogoType(settings.logoType)
    setLogoImage(settings.logoImage || "")
    setLogoText(settings.logoText || "")
    setFavicon(settings.favicon)
    setHasChanges(false)
    setMessage({ type: "success", text: "表单已重置" })
  }

  // 重置所有设置到默认值
  const handleResetSettings = async () => {
    if (confirm("确定要重置所有网站设置为默认值吗？此操作无法撤销。")) {
      setIsSubmitting(true)

      try {
        await resetSettings()
        setMessage({ type: "success", text: "网站设置已重置为默认值" })
      } catch (error) {
        console.error("重置设置失败:", error)
        setMessage({ type: "error", text: "重置设置失败，请重试" })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // 渲染预览
  const renderPreview = () => {
    return (
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold">网站预览</h3>

          {/* 标题预览 */}
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{siteName || "域名展示"}</span>
          </div>

          {/* Logo预览 */}
          <div className="flex h-16 w-full items-center justify-center rounded-md border bg-background p-2">
            {logoType === "image" && logoImage ? (
              <div className="h-12 max-h-12">
                <img
                  src={logoImage || "/placeholder.svg"}
                  alt="Logo预览"
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=48&width=120"
                    e.currentTarget.alt = "Logo加载失败"
                  }}
                />
              </div>
            ) : (
              <span className="text-xl font-bold">{logoText || siteName || "域名展示"}</span>
            )}
          </div>

          {/* Favicon预览 */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-muted-foreground">Favicon:</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background">
              {favicon ? (
                <img
                  src={favicon || "/placeholder.svg"}
                  alt="Favicon预览"
                  className="h-6 w-6"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                    e.currentTarget.alt = "Favicon加载失败"
                  }}
                />
              ) : (
                <Globe className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">网站设置</CardTitle>
            <CardDescription>自定义网站的外观和基本信息</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setPreviewMode(!previewMode)}>
                  {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{previewMode ? "关闭预览" : "显示预览"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      </CardHeader>

      <CardContent>
        <div className={`grid gap-6 ${previewMode ? "md:grid-cols-2" : "grid-cols-1"}`}>
          <div className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">基本设置</TabsTrigger>
                <TabsTrigger value="appearance">外观设置</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name" className="text-base">
                    网站名称
                  </Label>
                  <Input
                    id="site-name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="输入网站名称"
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">网站名称将显示在浏览器标签页和网站顶部</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon" className="text-base">
                    网站图标 (Favicon)
                  </Label>
                  <Input
                    id="favicon"
                    type="url"
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)}
                    placeholder="输入Favicon URL"
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">网站图标将显示在浏览器标签页和书签中</p>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-base">Logo 类型</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-md border p-4 transition-colors hover:bg-accent ${
                        logoType === "text" ? "border-primary bg-accent/50" : ""
                      }`}
                      onClick={() => setLogoType("text")}
                    >
                      <Type className="mb-2 h-8 w-8" />
                      <span className="text-sm font-medium">文字</span>
                    </div>
                    <div
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-md border p-4 transition-colors hover:bg-accent ${
                        logoType === "image" ? "border-primary bg-accent/50" : ""
                      }`}
                      onClick={() => setLogoType("image")}
                    >
                      <Image className="mb-2 h-8 w-8" />
                      <span className="text-sm font-medium">图片</span>
                    </div>
                  </div>
                </div>

                {logoType === "image" ? (
                  <div className="space-y-2">
                    <Label htmlFor="logo-image" className="text-base">
                      Logo 图片 URL
                    </Label>
                    <Input
                      id="logo-image"
                      type="url"
                      value={logoImage}
                      onChange={(e) => setLogoImage(e.target.value)}
                      placeholder="输入Logo图片URL"
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">推荐使用透明背景的PNG或SVG格式图片</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="logo-text" className="text-base">
                      Logo 文字
                    </Label>
                    <Input
                      id="logo-text"
                      type="text"
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      placeholder="输入Logo文字"
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">如果留空，将使用网站名��作为Logo文字</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {previewMode && <div className="flex items-center justify-center">{renderPreview()}</div>}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0">
        <div className="flex w-full space-x-2 sm:w-auto">
          <Button
            variant="default"
            onClick={handleSaveAll}
            disabled={!hasChanges || isSubmitting}
            className="flex-1 sm:flex-none"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleResetForm}
            disabled={!hasChanges || isSubmitting}
            className="flex-1 sm:flex-none"
          >
            <Undo2 className="mr-2 h-4 w-4" />
            撤销更改
          </Button>
        </div>

        <Separator className="sm:hidden" />

        <Button
          variant="destructive"
          onClick={handleResetSettings}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          重置为默认值
        </Button>
      </CardFooter>
    </Card>
  )
}

