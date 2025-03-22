import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// In a real app, you would use a database
// This is a simplified example for demonstration
const USERS = [{ id: "1", username: "admin", password: "password" }]

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  const user = USERS.find((u) => u.username === username && u.password === password)

  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
  }

  // Set a cookie for authentication
  cookies().set("auth-token", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  // Return user data (excluding password)
  const { password: _, ...userData } = user
  return NextResponse.json(userData)
}

