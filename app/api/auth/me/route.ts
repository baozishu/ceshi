import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// In a real app, you would use a database
// This is a simplified example for demonstration
const USERS = [{ id: "1", username: "admin", password: "password" }]

export async function GET() {
  const authToken = cookies().get("auth-token")?.value

  if (!authToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = USERS.find((u) => u.id === authToken)

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  // Return user data (excluding password)
  const { password: _, ...userData } = user
  return NextResponse.json(userData)
}

