import { type NextRequest, NextResponse } from "next/server"
import { readDb, writeDb } from "@/lib/json-db"
import { hashPassword } from "@/lib/hash-utils"
import fs from "fs"
import path from "path"
import { ensureBackupDir } from "@/lib/backup-utils"

// 备份密码
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // 更新数据库中的密码
    const db = readDb()
    db.auth.password = password
    db.auth.updatedAt = Date.now()
    writeDb(db)

    // 创建备份数据
    const backupData = {
      version: "1.0.0",
      timestamp: Date.now(),
      auth: {
        passwordHash: hashPassword(password),
        updatedAt: Date.now(),
      },
    }

    // 确保备份目录存在
    const backupDir = ensureBackupDir()

    // 读取现有备份文件（如果存在）
    const backupFilePath = path.join(backupDir, "backup.json")
    let existingBackup = {}

    if (fs.existsSync(backupFilePath)) {
      try {
        const content = fs.readFileSync(backupFilePath, "utf8")
        existingBackup = JSON.parse(content)
      } catch (error) {
        console.error("Error reading existing backup:", error)
      }
    }

    // 合并现有备份和新备份数据
    const updatedBackup = {
      ...existingBackup,
      ...backupData,
    }

    // 写入备份文件
    fs.writeFileSync(backupFilePath, JSON.stringify(updatedBackup, null, 2), "utf8")

    return NextResponse.json({
      success: true,
      message: "Password updated and backed up successfully",
    })
  } catch (error) {
    console.error("Error backing up password:", error)
    return NextResponse.json({ error: "Failed to backup password" }, { status: 500 })
  }
}

