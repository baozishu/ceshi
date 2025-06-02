'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkForm from '@/components/admin/WorkForm';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function AddWorkPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (workData: any) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '添加作品失败');
      }
      
      // 成功后跳转到作品列表页
      router.push('/admin/works');
    } catch (error) {
      console.error('添加作品失败:', error);
      alert(error instanceof Error ? error.message : '添加作品失败');
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
        <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">添加新作品</h1>
        <p className="text-gray-500 mt-1">创建一个新的作品展示</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
        <WorkForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
} 