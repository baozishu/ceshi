import fs from "fs"
import path from "path"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

import type { NavigationCategory } from "@/lib/types"

// Default navigation data
const defaultNavigationData: NavigationCategory[] = [
  {
    id: "social",
    name: "社交媒体",
    links: [
      { name: "微博", url: "https://weibo.com", description: "中国领先的社交媒体平台" },
      { name: "知乎", url: "https://zhihu.com", description: "中文互联网高质量的问答社区" },
      { name: "豆瓣", url: "https://douban.com", description: "书影音综合文化社区" },
      { name: "微信", url: "https://weixin.qq.com", description: "中国最流行的即时通讯软件" },
      { name: "小红书", url: "https://xiaohongshu.com", description: "年轻人的生活方式平台" },
    ],
  },
  {
    id: "shopping",
    name: "购物",
    links: [
      { name: "淘宝", url: "https://taobao.com", description: "中国最大的网上购物平台" },
      { name: "京东", url: "https://jd.com", description: "中国知名的综合网上购物平台" },
      { name: "拼多多", url: "https://pinduoduo.com", description: "社交电商平台" },
      { name: "天猫", url: "https://tmall.com", description: "综合性购物网站" },
      { name: "苏宁易购", url: "https://suning.com", description: "家电数码购物平台" },
    ],
  },
  {
    id: "video",
    name: "视频",
    links: [
      { name: "哔哩哔哩", url: "https://bilibili.com", description: "国内知名的视频弹幕网站" },
      { name: "爱奇艺", url: "https://iqiyi.com", description: "中国高清视频网站" },
      { name: "腾讯视频", url: "https://v.qq.com", description: "中国领先的在线视频媒体平台" },
      { name: "优酷", url: "https://youku.com", description: "优质视频网站" },
      { name: "抖音", url: "https://douyin.com", description: "短视频分享平台" },
    ],
  },
]

// In a real app, you would use a database
// This is a simplified example using the file system
const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "navigation.json")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultNavigationData, null, 2))
}

// Helper to check authentication
function isAuthenticated() {
  return cookies().has("auth-token")
}

// GET navigation data
export async function GET() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8")
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error("Error reading navigation data:", error)
    return NextResponse.json(defaultNavigationData)
  }
}

// PUT to update navigation data
export async function PUT(request: NextRequest) {
  // Check authentication
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const data = await request.json()
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating navigation data:", error)
    return NextResponse.json({ error: "Failed to update navigation data" }, { status: 500 })
  }
}

