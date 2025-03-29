import { type NextRequest, NextResponse } from "next/server"
import { readDb, writeDb, generateId } from "@/lib/json-db"

// GET: 获取所有友情链接
export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json(db.friendlyLinks)
  } catch (error) {
    console.error("Error fetching friendly links:", error)
    return NextResponse.json({ error: "Failed to fetch friendly links" }, { status: 500 })
  }
}

// POST: 创建新友情链接
export async function POST(request: NextRequest) {
  try {
    const link = await request.json()
    const db = readDb()

    // 生成ID（如果没有提供）
    const id = link.id || generateId()
    const now = Date.now()

    const newLink = {
      ...link,
      id,
      createdAt: now,
      updatedAt: now,
    }

    db.friendlyLinks.push(newLink)
    writeDb(db)

    return NextResponse.json(newLink)
  } catch (error) {
    console.error("Error creating friendly link:", error)
    return NextResponse.json({ error: "Failed to create friendly link" }, { status: 500 })
  }
}

// PUT: 更新友情链接
export async function PUT(request: NextRequest) {
  try {
    const link = await request.json()
    const db = readDb()

    const index = db.friendlyLinks.findIndex((l) => l.id === link.id)
    if (index === -1) {
      return NextResponse.json({ error: "Friendly link not found" }, { status: 404 })
    }

    const updatedLink = {
      ...db.friendlyLinks[index],
      ...link,
      updatedAt: Date.now(),
    }

    db.friendlyLinks[index] = updatedLink
    writeDb(db)

    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error("Error updating friendly link:", error)
    return NextResponse.json({ error: "Failed to update friendly link" }, { status: 500 })
  }
}

// DELETE: 删除友情链接
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Link ID is required" }, { status: 400 })
    }

    const db = readDb()
    db.friendlyLinks = db.friendlyLinks.filter((link) => link.id !== id)
    writeDb(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting friendly link:", error)
    return NextResponse.json({ error: "Failed to delete friendly link" }, { status: 500 })
  }
}

