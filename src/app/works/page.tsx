import React from 'react';
import { Work } from '@/lib/types';
import WorkCard from '@/components/works/WorkCard';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';

async function getWorks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/works`, { cache: 'no-store' });
  if (!res.ok) throw new Error('获取作品数据失败');
  return res.json();
}

export default async function WorksPage() {
  const works = await getWorks();
  
  // 按创建时间排序，最新的在前面
  const sortedWorks = [...works].sort(
    (a: Work, b: Work) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiChevronLeft className="mr-1" /> 返回首页
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          作品展示
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          浏览我的创意作品集合
        </p>
      </div>

      {works.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">暂无作品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedWorks.map((work: Work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  );
} 