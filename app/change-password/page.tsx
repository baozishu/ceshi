"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ChangePasswordPage() {
  const { changePassword } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "修改失败",
        description: "两次输入的新密码不一致",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await changePassword(passwordData.currentPassword, passwordData.newPassword)

      if (success) {
        toast({
          title: "修改成功",
          description: "密码已更新",
        })
        router.push("/")
      } else {
        toast({
          title: "修改失败",
          description: "当前密码错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "修改失败",
        description: "发生错误，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <CardTitle className="text-2xl">修改密码</CardTitle>
          </div>
          <CardDescription>请输入当前密码和新密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">当前密码</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="请输入当前密码"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="请输入新密码"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认新密码</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="请再次输入新密码"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "修改中..." : "修改密码"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" className="px-0 text-sm text-muted-foreground" onClick={() => router.push("/")}>
            返回首页
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}