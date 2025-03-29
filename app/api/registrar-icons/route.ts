import { type NextRequest, NextResponse } from "next/server"
import { readDb, writeDb } from "@/lib/json-db"

// GET: 获取所有注册商图标
export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json(db.registrarIcons)
  } catch (error) {
    console.error("Error fetching registrar icons:", error)
    return NextResponse.json({ error: "Failed to fetch registrar icons" }, { status: 500 })
  }
}

// POST: 添加新注册商图标
export async function POST(request: NextRequest) {
  try {
    const { name, svg } = await request.json()

    if (!name || !svg) {
      return NextResponse.json({ error: "Name and SVG are required" }, { status: 400 })
    }

    const db = readDb()

    // 检查名称是否已存在
    if (db.registrarIcons[name]) {
      return NextResponse.json({ error: "Icon with this name already exists" }, { status: 409 })
    }

    db.registrarIcons[name] = svg
    writeDb(db)

    return NextResponse.json({ name, svg })
  } catch (error) {
    console.error("Error adding registrar icon:", error)
    return NextResponse.json({ error: "Failed to add registrar icon" }, { status: 500 })
  }
}

// PUT: 更新注册商图标
export async function PUT(request: NextRequest) {
  try {
    const { name, svg } = await request.json()

    if (!name || !svg) {
      return NextResponse.json({ error: "Name and SVG are required" }, { status: 400 })
    }

    const db = readDb()

    // 检查图标是否存在
    if (!db.registrarIcons[name]) {
      return NextResponse.json({ error: "Icon not found" }, { status: 404 })
    }

    db.registrarIcons[name] = svg
    writeDb(db)

    return NextResponse.json({ name, svg })
  } catch (error) {
    console.error("Error updating registrar icon:", error)
    return NextResponse.json({ error: "Failed to update registrar icon" }, { status: 500 })
  }
}

// DELETE: 删除注册商图标
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "Icon name is required" }, { status: 400 })
    }

    const db = readDb()

    // 检查图标是否存在
    if (!db.registrarIcons[name]) {
      return NextResponse.json({ error: "Icon not found" }, { status: 404 })
    }

    delete db.registrarIcons[name]
    writeDb(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting registrar icon:", error)
    return NextResponse.json({ error: "Failed to delete registrar icon" }, { status: 500 })
  }
}

