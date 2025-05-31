import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "作品集展示",
    description: "展示我的技术项目和创意作品",
    keywords: ["作品集", "项目展示", "开发者", "作品展示"],
    authors: [{ name: "开发者" }],
    themeColor: "#3b82f6",
    icons: {
      icon: "https://www.dalao.net/view/img/favicon.ico",
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
