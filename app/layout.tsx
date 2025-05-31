import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

async function getSiteConfig() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/site-config.json`)
    if (!res.ok) return null
    const data = await res.json()
    return data.site
  } catch (error) {
    console.error("Failed to load site config:", error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()

  if (!siteConfig) {
    return {
      title: "作品集展示",
      description: "展示我的技术项目和创意作品",
    }
  }

  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author }],
    themeColor: siteConfig.themeColor,
    icons: {
      icon: siteConfig.favicon,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
