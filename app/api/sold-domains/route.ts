import { type NextRequest, NextResponse } from "next/server"
import { readDb, writeDb, generateId } from "@/lib/json-db"

// GET: 获取所有已售域名
export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json(db.soldDomains)
  } catch (error) {
    console.error("Error fetching sold domains:", error)
    return NextResponse.json({ error: "Failed to fetch sold domains" }, { status: 500 })
  }
}

// POST: 创建新已售域名
export async function POST(request: NextRequest) {
  try {
    const domain = await request.json()
    const db = readDb()

    // 生成ID（如果没有提供）
    const id = domain.id || generateId()
    const now = Date.now()

    const newDomain = {
      ...domain,
      id,
      status: domain.status || "sold",
      createdAt: now,
      updatedAt: now,
    }

    db.soldDomains.push(newDomain)
    writeDb(db)

    return NextResponse.json(newDomain)
  } catch (error) {
    console.error("Error creating sold domain:", error)
    return NextResponse.json({ error: "Failed to create sold domain" }, { status: 500 })
  }
}

// PUT: 更新已售域名
export async function PUT(request: NextRequest) {
  try {
    const domain = await request.json()
    const db = readDb()

    const index = db.soldDomains.findIndex((d) => d.id === domain.id)
    if (index === -1) {
      return NextResponse.json({ error: "Sold domain not found" }, { status: 404 })
    }

    const updatedDomain = {
      ...db.soldDomains[index],
      ...domain,
      status: domain.status || "sold",
      updatedAt: Date.now(),
    }

    db.soldDomains[index] = updatedDomain
    writeDb(db)

    return NextResponse.json(updatedDomain)
  } catch (error) {
    console.error("Error updating sold domain:", error)
    return NextResponse.json({ error: "Failed to update sold domain" }, { status: 500 })
  }
}

// DELETE: 删除已售域名
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Domain ID is required" }, { status: 400 })
    }

    const db = readDb()
    db.soldDomains = db.soldDomains.filter((domain) => domain.id !== id)
    writeDb(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sold domain:", error)
    return NextResponse.json({ error: "Failed to delete sold domain" }, { status: 500 })
  }
}

