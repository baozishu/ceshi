'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiSettings, FiGlobe, FiType, FiFileText, FiImage, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { SiteConfig } from '@/lib/types';

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig>({
    title: '',
    description: '',
    logo: '',
    footer: '',
    theme: 'system',
    social: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/config');
        
        if (!res.ok) {
          throw new Error('获取配置失败');
        }
        
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.error('获取配置失败:', err);
        setMessage({ type: 'error', text: '获取配置失败，请稍后再试' });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setConfig(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialKey]: value,
        },
      }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setMessage(null);
      
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!res.ok) {
        throw new Error('保存配置失败');
      }
      
      setMessage({ type: 'success', text: '配置已保存' });
    } catch (err) {
      console.error('保存配置失败:', err);
      setMessage({ type: 'error', text: '保存配置失败，请稍后再试' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">网站设置</h1>
        <p className="text-gray-500 mt-1">自定义您的网站配置和外观</p>
      </div>
      
      {message && (
        <div className={`p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300 animate-fade-in ${
          message.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
            <h2 className="flex items-center text-lg font-semibold text-gray-900">
              <FiGlobe className="mr-2 text-indigo-500" /> 基本设置
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="group">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                  <FiType className="inline-block mr-1" /> 网站标题
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={config.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
                />
              </div>
              
              <div className="group">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                  <FiImage className="inline-block mr-1" /> Logo URL（可选）
                </label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={config.logo || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
                />
                {config.logo && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <img
                      src={config.logo}
                      alt="Logo预览"
                      className="h-10 w-auto"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=Logo加载失败';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                <FiFileText className="inline-block mr-1" /> 网站描述
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={config.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="group">
                <label htmlFor="footer" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                  <FiFileText className="inline-block mr-1" /> 页脚文本
                </label>
                <input
                  type="text"
                  id="footer"
                  name="footer"
                  value={config.footer}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
                />
              </div>
              
              <div className="group">
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                  <FiSettings className="inline-block mr-1" /> 主题
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={config.theme}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
                >
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="system">跟随系统</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
            <h2 className="flex items-center text-lg font-semibold text-gray-900">
              <FiGithub className="mr-2 text-indigo-500" /> 社交媒体链接
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="group">
              <label htmlFor="social.github" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                <FiGithub className="inline-block mr-1" /> GitHub
              </label>
              <input
                type="text"
                id="social.github"
                name="social.github"
                value={config.social.github || ''}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
              />
            </div>
            
            <div className="group">
              <label htmlFor="social.twitter" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                <FiTwitter className="inline-block mr-1" /> Twitter
              </label>
              <input
                type="text"
                id="social.twitter"
                name="social.twitter"
                value={config.social.twitter || ''}
                onChange={handleChange}
                placeholder="https://twitter.com/username"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
              />
            </div>
            
            <div className="group">
              <label htmlFor="social.linkedin" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                <FiLinkedin className="inline-block mr-1" /> LinkedIn
              </label>
              <input
                type="text"
                id="social.linkedin"
                name="social.linkedin"
                value={config.social.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
              />
            </div>
            
            <div className="group">
              <label htmlFor="social.email" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                <FiMail className="inline-block mr-1" /> Email
              </label>
              <input
                type="email"
                id="social.email"
                name="social.email"
                value={config.social.email || ''}
                onChange={handleChange}
                placeholder="your@email.com"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all hover:border-indigo-300"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSaving ? (
              <>
                <span className="mr-2">保存中...</span>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> 保存设置
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 