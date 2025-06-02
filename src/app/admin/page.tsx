'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiImage, FiFolder, FiLink, FiUser, FiSettings, FiDatabase } from 'react-icons/fi';

interface Stats {
  worksCount: number;
  projectsCount: number;
  friendsCount: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    worksCount: 0,
    projectsCount: 0,
    friendsCount: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [worksRes, projectsRes, friendsRes] = await Promise.all([
          fetch('/api/works'),
          fetch('/api/projects'),
          fetch('/api/friends'),
        ]);

        const [works, projects, friends] = await Promise.all([
          worksRes.json(),
          projectsRes.json(),
          friendsRes.json(),
        ]);

        setStats({
          worksCount: works.length,
          projectsCount: projects.length,
          friendsCount: friends.length,
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    }

    fetchStats();
  }, []);

  const adminCards = [
    {
      title: '作品管理',
      description: '管理您的作品展示',
      icon: FiImage,
      href: '/admin/works',
      count: stats.worksCount,
      color: 'bg-blue-500',
    },
    {
      title: '项目管理',
      description: '管理您的项目展示',
      icon: FiFolder,
      href: '/admin/projects',
      count: stats.projectsCount,
      color: 'bg-green-500',
    },
    {
      title: '友情链接',
      description: '管理友情链接',
      icon: FiLink,
      href: '/admin/friends',
      count: stats.friendsCount,
      color: 'bg-purple-500',
    },
    {
      title: '账号设置',
      description: '更新您的账号信息',
      icon: FiUser,
      href: '/admin/account',
      color: 'bg-yellow-500',
    },
    {
      title: '数据备份',
      description: '备份和恢复数据',
      icon: FiDatabase,
      href: '/admin/backup',
      color: 'bg-red-500',
    },
    {
      title: '网站设置',
      description: '更新网站配置',
      icon: FiSettings,
      href: '/admin/settings',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">管理后台</h1>
        <p className="mt-1 text-gray-600">
          欢迎回来，{session?.user?.name || '管理员'}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiImage className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">作品数量</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.worksCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiFolder className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">项目数量</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.projectsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiLink className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">友情链接</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.friendsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 管理卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-full ${card.color} text-white`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">{card.title}</h2>
            </div>
            <p className="text-gray-600">{card.description}</p>
            {card.count !== undefined && (
              <p className="mt-2 text-sm text-gray-500">
                当前数量: <span className="font-semibold">{card.count}</span>
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
} 