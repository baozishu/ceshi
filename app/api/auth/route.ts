import { type NextRequest, NextResponse } from "next/server"
import { readDb, writeDb } from "@/lib/json-db"

// GET: 获取认证信息（不包含密码）
export async function GET() {
  try {
    const db = readDb()
    const { password, ...authInfo } = db.auth
    return NextResponse.json(authInfo)
  } catch (error) {
    console.error("Error fetching auth info:", error)
    return NextResponse.json({ error: "Failed to fetch auth info" }, { status: 500 })
  }
}

// POST: 登录
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const db = readDb()

    if (password === db.auth.password) {
      db.auth.isLoggedIn = true
      db.auth.updatedAt = Date.now()
      writeDb(db)

      const { password, ...authInfo } = db.auth
      return NextResponse.json({ ...authInfo, success: true })
    } else {
      return NextResponse.json({ error: "Invalid password", success: false }, { status: 401 })
    }
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Login failed", success: false }, { status: 500 })
  }
}

// PUT: 更新密码
export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()
    const db = readDb()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    if (currentPassword !== db.auth.password) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    db.auth.password = newPassword
    db.auth.updatedAt = Date.now()
    writeDb(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}

// DELETE: 登出
export async function DELETE() {
  try {
    const db = readDb()
    db.auth.isLoggedIn = false
    db.auth.updatedAt = Date.now()
    writeDb(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error during logout:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}

