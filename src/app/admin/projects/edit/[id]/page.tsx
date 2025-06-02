'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from '@/lib/types';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProject({ params }: EditProjectPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProject() {
      try {
        setIsLoading(true);
        setError('');
        
        const res = await fetch(`/api/projects/${id}`);
        
        if (!res.ok) {
          throw new Error('获取项目数据失败');
        }
        
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('获取项目失败:', err);
        setError('获取项目数据失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProject();
  }, [id]);

  const handleSubmit = async (projectData: Partial<Project>) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新项目失败');
      }

      // 成功后跳转到项目列表页
      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      console.error('更新项目失败:', err);
      setError(err instanceof Error ? err.message : '更新项目时发生错误');
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
          <FiEdit className="mr-3 h-7 w-7 text-green-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            编辑项目
          </h1>
        </div>
        <p className="text-gray-500 mt-1 ml-10">修改项目信息和展示内容</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-sm animate-fade-in">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : project ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <ProjectForm initialData={project} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-sm">
          找不到项目数据
        </div>
      )}
    </div>
  );
} 