"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface Domain {
  id: string
  name: string
  extension: string
  status: "active" | "available" | "sold"
  registrar?: string
  registrarIcon?: string
  registrationTime?: string
  expirationTime?: string
  purchaseUrl?: string
  soldTo?: string
  soldDate?: string
}

interface FriendlyLink {
  id: string
  name: string
  url: string
  description: string
}

interface DomainContextType {
  domains: Domain[]
  soldDomains: Domain[]
  friendlyLinks: FriendlyLink[]
  updateDomains: (newDomains: Domain[]) => void
  updateSoldDomains: (newSoldDomains: Domain[]) => void
  updateFriendlyLinks: (newFriendlyLinks: FriendlyLink[]) => void
  resetToDefaults: () => void
  loading: boolean
  error: string | null
}

// 创建上下文，提供默认值避免null检查
const DomainContext = createContext<DomainContextType>({
  domains: [],
  soldDomains: [],
  friendlyLinks: [],
  updateDomains: () => {},
  updateSoldDomains: () => {},
  updateFriendlyLinks: () => {},
  resetToDefaults: () => {},
  loading: true,
  error: null,
})

export function DomainProvider({ children }: { children: ReactNode }) {
  const [domains, setDomains] = useState<Domain[]>([])
  const [soldDomains, setSoldDomains] = useState<Domain[]>([])
  const [friendlyLinks, setFriendlyLinks] = useState<FriendlyLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 从API加载数据
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        // 加载域名数据
        const domainsResponse = await fetch("/api/domains")
        if (!domainsResponse.ok) {
          throw new Error(`Failed to load domains: ${domainsResponse.status} ${domainsResponse.statusText}`)
        }
        const domainsData = await domainsResponse.json()
        setDomains(domainsData)

        // 加载已售域名数据
        const soldDomainsResponse = await fetch("/api/sold-domains")
        if (!soldDomainsResponse.ok) {
          throw new Error(
            `Failed to load sold domains: ${soldDomainsResponse.status} ${soldDomainsResponse.statusText}`,
          )
        }
        const soldDomainsData = await soldDomainsResponse.json()
        setSoldDomains(soldDomainsData)

        // 加载友情链接数据
        const linksResponse = await fetch("/api/friendly-links")
        if (!linksResponse.ok) {
          throw new Error(`Failed to load friendly links: ${linksResponse.status} ${linksResponse.statusText}`)
        }
        const linksData = await linksResponse.json()
        setFriendlyLinks(linksData)

        setLoading(false)
      } catch (err) {
        console.error("Error loading domain data:", err)
        setError("加载数据失败，请刷新页面重试")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 更新域名数据
  const updateDomains = async (newDomains: Domain[]) => {
    try {
      setLoading(true)

      // 找出要删除的域名
      const domainsToDelete = domains.filter((domain) => !newDomains.some((newDomain) => newDomain.id === domain.id))

      // 删除域名
      for (const domain of domainsToDelete) {
        const response = await fetch(`/api/domains?id=${domain.id}`, { method: "DELETE" })
        if (!response.ok) {
          throw new Error(`Failed to delete domain: ${response.status} ${response.statusText}`)
        }
      }

      // 更新或创建域名
      for (const domain of newDomains) {
        const existingDomain = domains.find((d) => d.id === domain.id)

        if (existingDomain) {
          // 更新现有域名
          const response = await fetch("/api/domains", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(domain),
          })
          if (!response.ok) {
            throw new Error(`Failed to update domain: ${response.status} ${response.statusText}`)
          }
        } else {
          // 创建新域名
          const response = await fetch("/api/domains", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(domain),
          })
          if (!response.ok) {
            throw new Error(`Failed to create domain: ${response.status} ${response.statusText}`)
          }
        }
      }

      setDomains(newDomains)
      setLoading(false)
    } catch (err) {
      console.error("Error updating domains:", err)
      setError("更新域名数据失败")
      setLoading(false)
    }
  }

  // 更新已售域名数据
  const updateSoldDomains = async (newSoldDomains: Domain[]) => {
    try {
      setLoading(true)

      // 找出要删除的域名
      const domainsToDelete = soldDomains.filter(
        (domain) => !newSoldDomains.some((newDomain) => newDomain.id === domain.id),
      )

      // 删除域名
      for (const domain of domainsToDelete) {
        const response = await fetch(`/api/sold-domains?id=${domain.id}`, { method: "DELETE" })
        if (!response.ok) {
          throw new Error(`Failed to delete sold domain: ${response.status} ${response.statusText}`)
        }
      }

      // 更新或创建域名
      for (const domain of newSoldDomains) {
        const existingDomain = soldDomains.find((d) => d.id === domain.id)

        if (existingDomain) {
          // 更新现有域名
          const response = await fetch("/api/sold-domains", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(domain),
          })
          if (!response.ok) {
            throw new Error(`Failed to update sold domain: ${response.status} ${response.statusText}`)
          }
        } else {
          // 创建新域名
          const response = await fetch("/api/sold-domains", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(domain),
          })
          if (!response.ok) {
            throw new Error(`Failed to create sold domain: ${response.status} ${response.statusText}`)
          }
        }
      }

      setSoldDomains(newSoldDomains)
      setLoading(false)
    } catch (err) {
      console.error("Error updating sold domains:", err)
      setError("更新已售域名数据失败")
      setLoading(false)
    }
  }

  // 更新友情链接数据
  const updateFriendlyLinks = async (newFriendlyLinks: FriendlyLink[]) => {
    try {
      setLoading(true)

      // 找出要删除的链接
      const linksToDelete = friendlyLinks.filter((link) => !newFriendlyLinks.some((newLink) => newLink.id === link.id))

      // 删除链接
      for (const link of linksToDelete) {
        const response = await fetch(`/api/friendly-links?id=${link.id}`, { method: "DELETE" })
        if (!response.ok) {
          throw new Error(`Failed to delete friendly link: ${response.status} ${response.statusText}`)
        }
      }

      // 更新或创建链接
      for (const link of newFriendlyLinks) {
        const existingLink = friendlyLinks.find((l) => l.id === link.id)

        if (existingLink) {
          // 更新现有链接
          const response = await fetch("/api/friendly-links", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(link),
          })
          if (!response.ok) {
            throw new Error(`Failed to update friendly link: ${response.status} ${response.statusText}`)
          }
        } else {
          // 创建新链接
          const response = await fetch("/api/friendly-links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(link),
          })
          if (!response.ok) {
            throw new Error(`Failed to create friendly link: ${response.status} ${response.statusText}`)
          }
        }
      }

      setFriendlyLinks(newFriendlyLinks)
      setLoading(false)
    } catch (err) {
      console.error("Error updating friendly links:", err)
      setError("更新友情链接数据失败")
      setLoading(false)
    }
  }

  // 重置为默认数据
  const resetToDefaults = async () => {
    try {
      setLoading(true)
      setError(null)

      // 调用重置API
      const response = await fetch("/api/reset", { method: "POST" })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Reset failed with response:", errorText)
        throw new Error(`Reset failed: ${response.status} ${response.statusText}`)
      }

      // 重新加载数据
      const domainsResponse = await fetch("/api/domains")
      const soldDomainsResponse = await fetch("/api/sold-domains")
      const linksResponse = await fetch("/api/friendly-links")

      if (!domainsResponse.ok || !soldDomainsResponse.ok || !linksResponse.ok) {
        throw new Error("Failed to reload data after reset")
      }

      const domainsData = await domainsResponse.json()
      const soldDomainsData = await soldDomainsResponse.json()
      const linksData = await linksResponse.json()

      setDomains(domainsData)
      setSoldDomains(soldDomainsData)
      setFriendlyLinks(linksData)
      setLoading(false)
    } catch (err) {
      console.error("Error resetting to defaults:", err)
      setError("重置数据失败，请刷新页面重试")
      setLoading(false)
    }
  }

  const contextValue = {
    domains,
    soldDomains,
    friendlyLinks,
    updateDomains,
    updateSoldDomains,
    updateFriendlyLinks,
    resetToDefaults,
    loading,
    error,
  }

  return <DomainContext.Provider value={contextValue}>{children}</DomainContext.Provider>
}

export function useDomains() {
  return useContext(DomainContext)
}

