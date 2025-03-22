import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// In a real app, you would use a database
// This is a simplified example for demonstration
const USERS = [{ id: "1", username: "admin", password: "password" }]

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  // Check if username already exists
  if (USERS.some((u) => u.username === username)) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 })
  }

  // Create new user
  const newUser = {
    id: String(USERS.length + 1),
    username,
    password,
  }

  USERS.push(newUser)

  // Set a cookie for authentication
  cookies().set("auth-token", newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  // Return user data (excluding password)
  const { password: _, ...userData } = newUser
  return NextResponse.json(userData)
}

