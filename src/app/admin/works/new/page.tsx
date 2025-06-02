'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import WorkForm from '@/components/admin/WorkForm';
import { Work } from '@/lib/types';

export default function NewWork() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (workData: Partial<Work>) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...workData,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '添加作品失败');
      }

      // 成功后跳转到作品列表页
      router.push('/admin/works');
      router.refresh();
    } catch (err) {
      console.error('添加作品失败:', err);
      setError(err instanceof Error ? err.message : '添加作品时发生错误');
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
          <FiPlus className="mr-3 h-7 w-7 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            添加新作品
          </h1>
        </div>
        <p className="text-gray-500 mt-1 ml-10">创建新的作品展示</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-sm animate-fade-in">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
        <WorkForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
} 