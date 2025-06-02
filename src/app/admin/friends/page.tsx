'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiLink, FiExternalLink } from 'react-icons/fi';
import { FriendLink } from '@/lib/types';
import Link from 'next/link';

export default function FriendsManagement() {
  const [friends, setFriends] = useState<FriendLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFriends() {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch('/api/friends');
        
        if (!res.ok) {
          throw new Error('获取友情链接数据失败');
        }
        
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error('获取友情链接失败:', err);
        setError('获取友情链接数据失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFriends();
  }, []);

  const handleDeleteFriend = async (id: string) => {
    if (!window.confirm('确定要删除这个友情链接吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/friends/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('删除失败');
      }
      
      // 更新本地状态
      setFriends(friends.filter(friend => friend.id !== id));
    } catch (err) {
      console.error('删除友情链接失败:', err);
      setError('删除友情链接失败，请稍后再试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">友情链接管理</h1>
          <p className="text-gray-500 mt-1">管理您的友情链接展示</p>
        </div>
        <Link
          href="/admin/friends/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <FiPlus className="mr-2" /> 添加友链
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-sm animate-fade-in">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : friends.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100 transition-all hover:shadow-md">
          <div className="bg-purple-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <FiLink className="h-10 w-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">没有友情链接</h3>
          <p className="text-gray-500 mb-6">开始添加您的第一个友情链接吧</p>
          <Link
            href="/admin/friends/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiPlus className="mr-2" /> 添加友链
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <div 
              key={friend.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
            >
              <div className="p-5">
                <div className="flex items-center mb-4">
                  {friend.imageUrl ? (
                    <div className="flex-shrink-0 h-12 w-12 relative rounded-full overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={friend.imageUrl}
                        alt={friend.name}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiLink className="h-6 w-6 text-purple-500" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{friend.name}</h3>
                    <a 
                      href={friend.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      <span className="truncate max-w-[180px] inline-block">{friend.url.replace(/^https?:\/\//, '')}</span>
                      <FiExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{friend.description}</p>
                
                <div className="flex justify-end items-center pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/friends/edit/${friend.id}`}
                      className="p-2 rounded-full bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors"
                      title="编辑"
                    >
                      <FiEdit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteFriend(friend.id)}
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