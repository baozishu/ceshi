'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiChevronLeft, FiSearch } from 'react-icons/fi';
import WorkCard from '@/components/works/WorkCard';
import ProjectCard from '@/components/projects/ProjectCard';
import { Work, Project } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [works, setWorks] = useState<Work[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(query);
  
  useEffect(() => {
    async function fetchData() {
      if (!query.trim()) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');
      
      try {
        // 获取所有作品和项目
        const [worksRes, projectsRes] = await Promise.all([
          fetch('/api/works'),
          fetch('/api/projects')
        ]);
        
        if (!worksRes.ok || !projectsRes.ok) {
          throw new Error('获取数据失败');
        }
        
        const worksData = await worksRes.json();
        const projectsData = await projectsRes.json();
        
        // 过滤匹配搜索关键词的结果
        const queryLower = query.toLowerCase();
        
        const filteredWorks = worksData.filter((work: Work) => 
          work.title.toLowerCase().includes(queryLower) || 
          work.description.toLowerCase().includes(queryLower) ||
          work.tags.some((tag: string) => tag.toLowerCase().includes(queryLower))
        );
        
        const filteredProjects = projectsData.filter((project: Project) => 
          project.name.toLowerCase().includes(queryLower) || 
          project.description.toLowerCase().includes(queryLower) ||
          project.technologies.some((tech: string) => tech.toLowerCase().includes(queryLower))
        );
        
        setWorks(filteredWorks);
        setProjects(filteredProjects);
      } catch (err) {
        console.error('搜索失败:', err);
        setError('搜索数据时出错，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery);
      window.location.href = url.toString();
    }
  };
  
  const totalResults = works.length + projects.length;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FiChevronLeft className="mr-1" /> 返回首页
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          搜索结果: {query ? `"${query}"` : ''}
        </h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索作品、项目..."
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
            >
              <FiSearch className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">没有找到结果</h2>
          <p className="text-gray-500">
            {query ? `没有找到与 "${query}" 相关的作品或项目` : '请输入搜索关键词'}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {works.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
                作品 ({works.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {works.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            </section>
          )}
          
          {projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-green-600 pl-4">
                项目 ({projects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
} 