/**
 * 简单的密码哈希工具
 * 注意：在生产环境中，应使用更安全的哈希算法如 bcrypt
 */

// 创建简单的哈希值（仅用于演示）
export function hashPassword(password: string): string {
  // 在实际应用中，应使用更安全的哈希算法
  // 这里使用简单的方法进行演示
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 转换为32位整数
  }

  // 转换为16进制字符串并添加时间戳作为盐
  const salt = Date.now().toString(36)
  const hashHex = (hash >>> 0).toString(16)
  return `${hashHex}.${salt}`
}

// 验证哈希值（仅用于演示）
export function verifyPassword(password: string, hashedPassword: string): boolean {
  // 在实际应用中，应使用对应的哈希验证方法
  // 这里仅作演示，实际上应该比较哈希值
  const [hashHex, _] = hashedPassword.split(".")

  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  return (hash >>> 0).toString(16) === hashHex
}

