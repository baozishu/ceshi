import fs from "fs"
import path from "path"
import { hashPassword } from "./hash-utils"

// 确保备份目录存在
export function ensureBackupDir() {
  const backupDir = path.join(process.cwd(), "data", "backups")
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  return backupDir
}

// 获取备份历史
export function getBackupHistory() {
  const backupDir = ensureBackupDir()

  try {
    const files = fs.readdirSync(backupDir)
    const backups = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(backupDir, file)
        const stats = fs.statSync(filePath)

        try {
          const content = fs.readFileSync(filePath, "utf8")
          const data = JSON.parse(content)

          return {
            filename: file,
            timestamp: data.timestamp || stats.mtimeMs,
            size: stats.size,
            items: {
              domains: Array.isArray(data.domains) ? data.domains.length : 0,
              soldDomains: Array.isArray(data.soldDomains) ? data.soldDomains.length : 0,
              friendlyLinks: Array.isArray(data.friendlyLinks) ? data.friendlyLinks.length : 0,
              registrarIcons: data.registrarIcons ? Object.keys(data.registrarIcons).length : 0,
            },
          }
        } catch (error) {
          console.error(`Error parsing backup file ${file}:`, error)
          return null
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp)

    return backups
  } catch (error) {
    console.error("Error reading backup directory:", error)
    return []
  }
}

// 创建备份文件
export function createBackupFile(data: any, filename?: string) {
  const backupDir = ensureBackupDir()

  // 生成文件名
  const date = new Date()
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`

  const backupFilename = filename || `domain-backup-${formattedDate}.json`
  const backupPath = path.join(backupDir, backupFilename)

  // 写入文件
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf8")

  return {
    filename: backupFilename,
    path: backupPath,
  }
}

// 读取备份文件
export function readBackupFile(filename: string) {
  const backupDir = ensureBackupDir()
  const backupPath = path.join(backupDir, filename)

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file ${filename} not found`)
  }

  const content = fs.readFileSync(backupPath, "utf8")
  return JSON.parse(content)
}

// 删除备份文件
export function deleteBackupFile(filename: string) {
  const backupDir = ensureBackupDir()
  const backupPath = path.join(backupDir, filename)

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file ${filename} not found`)
  }

  fs.unlinkSync(backupPath)
  return true
}

// 更新备份文件中的密码
export function updatePasswordInBackup(password: string, filename = "backup.json") {
  const backupDir = ensureBackupDir()
  const backupPath = path.join(backupDir, filename)

  let backupData = {}

  // 如果备份文件存在，读取它
  if (fs.existsSync(backupPath)) {
    try {
      const content = fs.readFileSync(backupPath, "utf8")
      backupData = JSON.parse(content)
    } catch (error) {
      console.error(`Error reading backup file ${filename}:`, error)
    }
  }

  // 更新密码哈希
  const updatedBackup = {
    ...backupData,
    version: "1.0.0",
    timestamp: Date.now(),
    auth: {
      ...(backupData as any).auth,
      passwordHash: hashPassword(password),
      updatedAt: Date.now(),
    },
  }

  // 写入更新后的备份
  fs.writeFileSync(backupPath, JSON.stringify(updatedBackup, null, 2), "utf8")

  return {
    success: true,
    message: "Password updated in backup",
    path: backupPath,
  }
}

