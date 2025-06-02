'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FiHome, 
  FiSettings, 
  FiImage, 
  FiFolder, 
  FiLink, 
  FiDatabase, 
  FiUser, 
  FiMenu, 
  FiX 
} from 'react-icons/fi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 如果用户未登录，重定向到登录页
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 加载状态
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 未登录状态
  if (status === 'unauthenticated') {
    return null;
  }

  const menuItems = [
    { name: '管理首页', href: '/admin', icon: FiHome },
    { name: '账号设置', href: '/admin/account', icon: FiUser },
    { name: '作品管理', href: '/admin/works', icon: FiImage },
    { name: '项目管理', href: '/admin/projects', icon: FiFolder },
    { name: '友情链接', href: '/admin/friends', icon: FiLink },
    { name: '数据备份', href: '/admin/backup', icon: FiDatabase },
    { name: '网站设置', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 - 桌面版 */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } hidden md:block bg-white shadow-md transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`font-bold text-xl text-blue-600 ${!isSidebarOpen && 'hidden'}`}>
            管理后台
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label={isSidebarOpen ? '收起侧边栏' : '展开侧边栏'}
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        <nav className="mt-5">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <item.icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 移动版菜单按钮 */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-md shadow-md"
          aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* 移动版侧边栏 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50">
          <aside className="w-64 h-full bg-white shadow-md">
            <div className="p-4 flex items-center justify-between">
              <h1 className="font-bold text-xl text-blue-600">管理后台</h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="关闭菜单"
              >
                <FiX />
              </button>
            </div>
            <nav className="mt-5">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 