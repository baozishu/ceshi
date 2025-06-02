'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';

export default function AccountSettings() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameMessage, setNameMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setNameMessage({ type: 'error', text: '名称不能为空' });
      return;
    }
    
    try {
      setIsNameLoading(true);
      setNameMessage({ type: '', text: '' });
      
      const response = await fetch('/api/user/update-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNameMessage({ type: 'success', text: '名称更新成功' });
      } else {
        setNameMessage({ type: 'error', text: data.error || '更新失败' });
      }
    } catch (error) {
      console.error('更新名称失败:', error);
      setNameMessage({ type: 'error', text: '更新时发生错误' });
    } finally {
      setIsNameLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: '请填写所有密码字段' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: '新密码与确认密码不匹配' });
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: '新密码长度至少为6个字符' });
      return;
    }
    
    try {
      setIsPasswordLoading(true);
      setPasswordMessage({ type: '', text: '' });
      
      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPasswordMessage({ type: 'success', text: '密码更新成功' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.error || '更新失败' });
      }
    } catch (error) {
      console.error('更新密码失败:', error);
      setPasswordMessage({ type: 'error', text: '更新时发生错误' });
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">账号设置</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 更新名称 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiUser className="mr-2" /> 更新显示名称
          </h2>
          
          <form onSubmit={handleNameUpdate}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                显示名称
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {nameMessage.text && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  nameMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {nameMessage.text}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isNameLoading}
              className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isNameLoading ? (
                <>
                  <span className="mr-2">更新中...</span>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> 保存名称
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* 更新密码 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiLock className="mr-2" /> 更改密码
          </h2>
          
          <form onSubmit={handlePasswordUpdate}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                当前密码
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                新密码
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                确认新密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {passwordMessage.text && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  passwordMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isPasswordLoading}
              className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isPasswordLoading ? (
                <>
                  <span className="mr-2">更新中...</span>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> 更新密码
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 