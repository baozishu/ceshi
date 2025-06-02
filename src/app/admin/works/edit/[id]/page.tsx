'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import WorkForm from '@/components/admin/WorkForm';
import { Work } from '@/lib/types';

interface EditWorkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditWork({ params }: EditWorkPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchWork() {
      try {
        setIsLoading(true);
        setError('');
        
        const res = await fetch(`/api/works/${id}`);
        
        if (!res.ok) {
          throw new Error('获取作品数据失败');
        }
        
        const data = await res.json();
        setWork(data);
      } catch (err) {
        console.error('获取作品失败:', err);
        setError('获取作品数据失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWork();
  }, [id]);

  const handleSubmit = async (workData: Partial<Work>) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch(`/api/works/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新作品失败');
      }
      
      // 成功后跳转到作品列表页
      router.push('/admin/works');
      router.refresh();
    } catch (err) {
      console.error('更新作品失败:', err);
      setError(err instanceof Error ? err.message : '更新作品时发生错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/admin/works" 
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiArrowLeft className="mr-1" /> 返回作品列表
        </Link>
        <div className="flex items-center mt-2">
          <FiEdit className="mr-3 h-7 w-7 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            编辑作品
          </h1>
        </div>
        <p className="text-gray-500 mt-1 ml-10">修改作品信息和展示内容</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-sm animate-fade-in">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : work ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <WorkForm initialData={work} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-sm">
          找不到作品数据
        </div>
      )}
    </div>
  );
} 