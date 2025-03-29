import { type NextRequest, NextResponse } from "next/server"
import { readDb, writeDb, generateId } from "@/lib/json-db"

// GET: 获取所有域名
export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json(db.domains)
  } catch (error) {
    console.error("Error fetching domains:", error)
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 })
  }
}

// POST: 创建新域名
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
      createdAt: now,
      updatedAt: now,
    }

    db.domains.push(newDomain)
    writeDb(db)

    return NextResponse.json(newDomain)
  } catch (error) {
    console.error("Error creating domain:", error)
    return NextResponse.json({ error: "Failed to create domain" }, { status: 500 })
  }
}

// PUT: 更新域名
export async function PUT(request: NextRequest) {
  try {
    const domain = await request.json()
    const db = readDb()

    const index = db.domains.findIndex((d) => d.id === domain.id)
    if (index === -1) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }

    const updatedDomain = {
      ...db.domains[index],
      ...domain,
      updatedAt: Date.now(),
    }

    db.domains[index] = updatedDomain
    writeDb(db)

    return NextResponse.json(updatedDomain)
  } catch (error) {
    console.error("Error updating domain:", error)
    return NextResponse.json({ error: "Failed to update domain" }, { status: 500 })
  }
}

// DELETE: 删除域名
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Domain ID is required" }, { status: 400 })
    }

    const db = readDb()
    db.domains = db.domains.filter((domain) => domain.id !== id)
    writeDb(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting domain:", error)
    return NextResponse.json({ error: "Failed to delete domain" }, { status: 500 })
  }
}

