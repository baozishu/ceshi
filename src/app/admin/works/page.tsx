'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiStar, FiImage } from 'react-icons/fi';
import { Work } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default function WorksManagement() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchWorks() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch('/api/works');
        
        if (!res.ok) {
          throw new Error('获取作品数据失败');
        }
        
        const data = await res.json();
        setWorks(data);
      } catch (err) {
        console.error('获取作品失败:', err);
        setError('获取作品数据失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWorks();
  }, []);

  const handleTogglePinned = async (id: string, currentPinned: boolean) => {
    try {
      const res = await fetch(`/api/works/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPinned: !currentPinned }),
      });
      
      if (!res.ok) {
        throw new Error('更新失败');
      }
      
      // 更新本地状态
      setWorks(works.map(work => 
        work.id === id ? { ...work, isPinned: !work.isPinned } : work
      ));
    } catch (err) {
      console.error('更新置顶状态失败:', err);
      setError('更新置顶状态失败，请稍后再试');
    }
  };

  const handleDeleteWork = async (id: string) => {
    if (!window.confirm('确定要删除这个作品吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/works/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('删除失败');
      }
      
      // 更新本地状态
      setWorks(works.filter(work => work.id !== id));
    } catch (err) {
      console.error('删除作品失败:', err);
      setError('删除作品失败，请稍后再试');
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">作品管理</h1>
          <p className="text-gray-500 mt-1">管理您的个人作品展示</p>
        </div>
        <Link
          href="/admin/works/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" /> 添加作品
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-sm animate-fade-in">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : works.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100 transition-all hover:shadow-md">
          <div className="bg-blue-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <FiImage className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">没有作品</h3>
          <p className="text-gray-500 mb-6">开始添加您的第一个作品吧</p>
          <Link
            href="/admin/works/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" /> 添加作品
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <div 
              key={work.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
            >
              <div className="relative h-48 bg-gray-100">
                {imageErrors[work.id] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FiImage className="h-10 w-10 mb-2" />
                    <span className="text-sm">图片加载失败</span>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={work.imageUrl}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      onError={() => handleImageError(work.id)}
                      priority={false}
                    />
                  </div>
                )}
                {work.isPinned && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-white shadow-sm z-10">
                    置顶
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{work.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{work.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {work.tags && work.tags.length > 0 ? (
                    work.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">无标签</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(work.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTogglePinned(work.id, work.isPinned)}
                      className={`p-2 rounded-full transition-colors ${work.isPinned ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                      title={work.isPinned ? '取消置顶' : '置顶'}
                    >
                      <FiStar className={`h-4 w-4 ${work.isPinned ? 'fill-yellow-400' : ''}`} />
                    </button>
                    <Link
                      href={`/admin/works/edit/${work.id}`}
                      className="p-2 rounded-full bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors"
                      title="编辑"
                    >
                      <FiEdit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteWork(work.id)}
                      className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="删除"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 