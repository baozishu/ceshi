import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const USERS = [{ id: "1", username: "admin", password: "password" }]

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const user = USERS.find((u) => u.id === authToken)
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    if (user.password !== currentPassword) {
      return NextResponse.json({ error: "当前密码错误" }, { status: 400 })
    }

    user.password = newPassword

    return NextResponse.json({ message: "密码修改成功" })
  } catch (error) {
    console.error("Change password failed:", error)
    return NextResponse.json({ error: "密码修改失败" }, { status: 500 })
  }
}