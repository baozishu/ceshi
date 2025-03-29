import { type NextRequest, NextResponse } from "next/server"
import { readDb, writeDb } from "@/lib/json-db"

// GET: 获取站点设置
export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json(db.siteSettings)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 })
  }
}

// PUT: 更新站点设置
export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()
    const db = readDb()

    db.siteSettings = {
      ...db.siteSettings,
      ...settings,
      updatedAt: Date.now(),
    }

    writeDb(db)

    return NextResponse.json(db.siteSettings)
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 })
  }
}

