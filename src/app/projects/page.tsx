import React from 'react';
import { Project } from '@/lib/types';
import ProjectCard from '@/components/projects/ProjectCard';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects`, { cache: 'no-store' });
  if (!res.ok) throw new Error('获取项目数据失败');
  return res.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  // 按创建时间排序，最新的在前面
  const sortedProjects = [...projects].sort(
    (a: Project, b: Project) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <FiChevronLeft className="mr-1" /> 返回首页
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          项目展示
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          浏览我的技术项目集合
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">暂无项目</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProjects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
} 