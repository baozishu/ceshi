import { type NextRequest, NextResponse } from "next/server"
import { readDb } from "@/lib/json-db"
import { hashPassword } from "@/lib/hash-utils"
import fs from "fs"
import path from "path"

// 备份数据结构
interface BackupData {
  version: string
  timestamp: number
  registrarIcons: Record<string, string>
  domains: any[]
  soldDomains: any[]
  friendlyLinks: any[]
  siteSettings: any
  auth: {
    passwordHash: string
  }
}

// 获取备份数据
export async function GET() {
  try {
    const db = readDb()

    // 创建备份数据结构
    const backupData: BackupData = {
      version: "1.0.0",
      timestamp: Date.now(),
      registrarIcons: db.registrarIcons,
      domains: db.domains,
      soldDomains: db.soldDomains,
      friendlyLinks: db.friendlyLinks,
      siteSettings: db.siteSettings,
      auth: {
        passwordHash: hashPassword(db.auth.password),
      },
    }

    return NextResponse.json(backupData)
  } catch (error) {
    console.error("Error creating backup:", error)
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
  }
}

// 导入备份
export async function POST(request: NextRequest) {
  try {
    const backupData = await request.json()

    // 验证备份数据
    if (!backupData || !backupData.version || !backupData.timestamp) {
      return NextResponse.json({ error: "Invalid backup data" }, { status: 400 })
    }

    // 创建备份文件
    const backupDir = path.join(process.cwd(), "data", "backups")
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    const filename = `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`
    const backupPath = path.join(backupDir, filename)

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))

    return NextResponse.json({
      success: true,
      message: "Backup imported successfully",
      filename,
    })
  } catch (error) {
    console.error("Error importing backup:", error)
    return NextResponse.json({ error: "Failed to import backup" }, { status: 500 })
  }
}

