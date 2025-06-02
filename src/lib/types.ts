// 用户类型
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

// 作品类型
export interface Work {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  tags: string[];
  createdAt: string;
  isPinned: boolean;
}

// 项目类型
export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  repoUrl?: string;
  demoUrl?: string;
  technologies: string[];
  createdAt: string;
  isPinned: boolean;
}

// 友情链接类型
export interface FriendLink {
  id: string;
  name: string;
  url: string;
  description: string;
  imageUrl?: string;
}

// 站点配置类型
export interface SiteConfig {
  title: string;
  description: string;
  logo?: string;
  footer: string;
  theme: 'light' | 'dark' | 'system';
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
} 