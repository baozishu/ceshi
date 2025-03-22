export interface User {
  id: string
  username: string
}

export interface NavigationCategory {
  id: string
  name: string
  links: NavigationLink[]
}

export interface NavigationLink {
  name: string
  url: string
  description: string
  logo?: string
}

export interface SiteData {
  name: string
  url: string
  description: string
  logo?: string
  categoryId: string
}

