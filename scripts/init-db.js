const fs = require("fs")
const path = require("path")

// 确保数据目录存在
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// 数据库文件路径
const DB_PATH = path.join(process.cwd(), "data", "db.json")

// 默认数据
const DEFAULT_DB = {
  domains: [
    {
      id: "1",
      name: "example",
      extension: ".com",
      status: "available",
      registrar: "阿里云",
      registrarIcon: "aliyun",
      registrationTime: "2023-05-15",
      expirationTime: "2025-05-15",
      purchaseUrl: "https://wanwang.aliyun.com/domain/searchresult?keyword=example.com",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // 其他域名...
  ],
  soldDomains: [
    {
      id: "s1",
      name: "premium",
      extension: ".com",
      status: "sold",
      soldTo: "科技解决方案公司",
      soldDate: "2025-02-15",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // 其他已售域名...
  ],
  friendlyLinks: [
    {
      id: "1",
      name: "域名注册服务",
      url: "https://example.com/register",
      description: "提供专业的域名注册和管理服务",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    // 其他友情链接...
  ],
  siteSettings: {
    id: "default",
    siteName: "域名展示",
    logoType: "text",
    logoText: "域名展示",
    favicon: "https://xn--1xa.team/img/favicon.ico",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  registrarIcons: {
    aliyun: `<svg t="1742606538431" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3384" width="24" height="24"><path d="M0 0h1024v1024H0z" fill="#FFFFFF" p-id="3385"></path><path d="M362.752 476.864h298.496v67.328H362.752z" fill="#FF8F00" p-id="3386"></path><path d="M810.816 232.64H613.312l47.68 67.456 144 44.16a62.272 62.272 0 0 1 43.456 59.776V619.968a62.272 62.272 0 0 1-43.52 59.84l-144 44.096-47.616 67.456h197.504A149.184 149.184 0 0 0 960 642.176V381.824a149.184 149.184 0 0 0-149.184-149.12z m-597.632 0h197.504L363.008 300.16l-144 44.16a62.272 62.272 0 0 0-43.456 59.776V619.968a62.272 62.272 0 0 0 43.52 59.84l144 44.096 47.616 67.456H213.184A149.184 149.184 0 0 1 64 642.176V381.824a149.184 149.184 0 0 1 149.184-149.12z" fill="#FF8F00" p-id="3387"></path></svg>`,
    // 其他图标...
  },
  auth: {
    id: "admin",
    password: "admin123",
    isLoggedIn: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
}

console.log("🔄 Initializing JSON database...")

try {
  // 检查数据库文件是否存在
  if (!fs.existsSync(DB_PATH)) {
    // 创建默认数据库文件
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf8")
    console.log("✅ JSON database created successfully")
  } else {
    console.log("✅ JSON database already exists")
  }
} catch (error) {
  console.error("❌ Failed to initialize JSON database:", error)
  process.exit(1)
}

