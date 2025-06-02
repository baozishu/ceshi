'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from '@/lib/types';

export default function NewProject() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (projectData: Partial<Project>) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '添加项目失败');
      }

      // 成功后跳转到项目列表页
      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      console.error('添加项目失败:', err);
      setError(err instanceof Error ? err.message : '添加项目时发生错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-green-600 hover:text-green-800 transition-colors"
        >
          <FiArrowLeft className="mr-1" /> 返回项目列表
        </Link>
        <div className="flex items-center mt-2">
          <FiPlus className="mr-3 h-7 w-7 text-green-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            添加新项目
          </h1>
        </div>
        <p className="text-gray-500 mt-1 ml-10">创建新的项目展示</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-sm animate-fade-in">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
        <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
} 