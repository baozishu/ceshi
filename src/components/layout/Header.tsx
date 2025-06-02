'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 左侧logo */}
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-blue-600">
              个人作品集
            </Link>
          </div>

          {/* 中间导航 - 桌面端 */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium ${
                isActive('/') ? 'text-blue-600 border-b-2 border-blue-600' : ''
              }`}
            >
              首页
            </Link>
            <Link
              href="/works"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium ${
                isActive('/works') ? 'text-blue-600 border-b-2 border-blue-600' : ''
              }`}
            >
              作品
            </Link>
            <Link
              href="/projects"
              className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium ${
                isActive('/projects') ? 'text-blue-600 border-b-2 border-blue-600' : ''
              }`}
            >
              项目
            </Link>
          </nav>

          {/* 右侧功能区 */}
          <div className="flex items-center space-x-4">
            {/* 搜索按钮 */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="搜索"
            >
              <FiSearch className="h-5 w-5 text-gray-600" />
            </button>

            {/* 登录/管理按钮 */}
            {session ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  管理后台
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  退出登录
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                登录
              </Link>
            )}

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              {isMenuOpen ? (
                <FiX className="h-5 w-5 text-gray-600" />
              ) : (
                <FiMenu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        {isSearchOpen && (
          <div className="py-3">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索作品、项目..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1"
                  aria-label="搜索"
                >
                  <FiSearch className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col px-4 py-2">
            <Link
              href="/"
              className={`px-3 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive('/') ? 'text-blue-600 font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/works"
              className={`px-3 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive('/works') ? 'text-blue-600 font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              作品
            </Link>
            <Link
              href="/projects"
              className={`px-3 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive('/projects') ? 'text-blue-600 font-medium' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              项目
            </Link>
            {session ? (
              <>
                <Link
                  href="/admin"
                  className={`px-3 py-3 text-gray-700 hover:bg-gray-100 ${
                    isActive('/admin') ? 'text-blue-600 font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  管理后台
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-3 text-gray-700 hover:bg-gray-100 text-left"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`px-3 py-3 text-gray-700 hover:bg-gray-100 ${
                  isActive('/login') ? 'text-blue-600 font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                登录
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 