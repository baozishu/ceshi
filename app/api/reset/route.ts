import { NextResponse } from "next/server"
import { resetDb } from "@/lib/json-db"

export async function POST() {
  try {
    resetDb()
    return NextResponse.json({ success: true, message: "Database reset successfully" })
  } catch (error) {
    console.error("Error resetting database:", error)
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 })
  }
}

