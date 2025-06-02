'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import FriendForm from '@/components/admin/FriendForm';
import { FriendLink } from '@/lib/types';

interface EditFriendPageProps {
  params: {
    id: string;
  };
}

export default function EditFriend({ params }: EditFriendPageProps) {
  const router = useRouter();
  const [friend, setFriend] = useState<FriendLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFriend() {
      try {
        setIsLoading(true);
        setError('');
        
        const res = await fetch(`/api/friends/${params.id}`);
        
        if (!res.ok) {
          throw new Error('获取友情链接数据失败');
        }
        
        const data = await res.json();
        setFriend(data);
      } catch (err) {
        console.error('获取友情链接失败:', err);
        setError('获取友情链接数据失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFriend();
  }, [params.id]);

  const handleSubmit = async (friendData: Partial<FriendLink>) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch(`/api/friends/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(friendData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新友情链接失败');
      }

      // 成功后跳转到友情链接列表页
      router.push('/admin/friends');
      router.refresh();
    } catch (err) {
      console.error('更新友情链接失败:', err);
      setError(err instanceof Error ? err.message : '更新友情链接时发生错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/friends"
          className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          <FiArrowLeft className="mr-1" /> 返回友情链接列表
        </Link>
        <div className="flex items-center mt-2">
          <FiEdit className="mr-3 h-7 w-7 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            编辑友情链接
          </h1>
        </div>
        <p className="text-gray-500 mt-1 ml-10">修改友情链接信息</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-sm animate-fade-in">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : friend ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <FriendForm initialData={friend} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-sm">
          找不到友情链接数据
        </div>
      )}
    </div>
  );
} 