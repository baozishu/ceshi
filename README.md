# 域名展示系统

这是一个使用Next.js构建的域名展示系统，使用JSON文件作为数据存储。

## 功能特点

- 域名展示和管理
- 已售域名记录
- 友情链接管理
- 站点设置自定义
- 注册商图标管理
- 管理员认证

## 数据存储

系统使用单个JSON文件存储所有数据，位于`data/db.json`。数据结构如下：

```json
{
  "domains": [...],
  "soldDomains": [...],
  "friendlyLinks": [...],
  "siteSettings": {...},
  "registrarIcons": {...},
  "auth": {...}
}

