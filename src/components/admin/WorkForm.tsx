'use client';

import { useState, useEffect } from 'react';
import { Work } from '@/lib/types';
import { FiSave, FiX, FiPlus, FiImage, FiTag, FiLink, FiType, FiFileText, FiStar } from 'react-icons/fi';

interface WorkFormProps {
  initialData?: Work;
  onSubmit: (workData: Partial<Work>) => Promise<void>;
  isSubmitting: boolean;
}

const emptyWork: Partial<Work> = {
  title: '',
  description: '',
  imageUrl: '',
  link: '',
  tags: [],
  isPinned: false,
};

export default function WorkForm({ initialData, onSubmit, isSubmitting }: WorkFormProps) {
  const [formData, setFormData] = useState<Partial<Work>>(initialData || emptyWork);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviewLoaded, setImagePreviewLoaded] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim();
    if (formData.tags?.includes(newTag)) {
      setErrors(prev => ({ ...prev, tags: '标签已存在' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTag],
    }));
    setTagInput('');
    setErrors(prev => ({ ...prev, tags: '' }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) {
      newErrors.title = '标题不能为空';
    }
    if (!formData.description?.trim()) {
      newErrors.description = '描述不能为空';
    }
    if (!formData.imageUrl?.trim()) {
      newErrors.imageUrl = '图片URL不能为空';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 提交表单
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="group">
            <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              <FiType className="mr-2 h-4 w-4" />
              标题 <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all hover:border-blue-300 ${
                errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="输入作品标题"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiX className="mr-1" /> {errors.title}
              </p>
            )}
          </div>

          <div className="group">
            <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              <FiFileText className="mr-2 h-4 w-4" />
              描述 <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all hover:border-blue-300 ${
                errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="描述您的作品..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiX className="mr-1" /> {errors.description}
              </p>
            )}
          </div>

          <div className="group">
            <label htmlFor="link" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              <FiLink className="mr-2 h-4 w-4" />
              链接URL（可选）
            </label>
            <input
              type="text"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all hover:border-blue-300"
              placeholder="https://example.com"
            />
          </div>
          
          <div className="group">
            <label className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              <FiTag className="mr-2 h-4 w-4" />
              标签
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 min-w-0 block w-full rounded-l-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all hover:border-blue-300"
                placeholder="输入标签后按回车或点击添加"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex items-center px-4 py-2 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors sm:text-sm"
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiX className="mr-1" /> {errors.tags}
              </p>
            )}
            
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 group"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300 hover:text-blue-700 transition-colors"
                    aria-label={`移除标签 ${tag}`}
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {formData.tags?.length === 0 && (
                <span className="text-sm text-gray-500 italic">暂无标签</span>
              )}
            </div>
          </div>

          <div className="flex items-center group">
            <input
              id="isPinned"
              name="isPinned"
              type="checkbox"
              checked={formData.isPinned}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
            />
            <label htmlFor="isPinned" className="ml-2 flex items-center text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
              <FiStar className={`mr-1 h-4 w-4 ${formData.isPinned ? 'text-yellow-500 fill-yellow-500' : ''}`} />
              置顶作品
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label htmlFor="imageUrl" className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              <FiImage className="mr-2 h-4 w-4" />
              图片URL <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all hover:border-blue-300 ${
                errors.imageUrl ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiX className="mr-1" /> {errors.imageUrl}
              </p>
            )}
            {formData.imageUrl && (
              <div className={`mt-3 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 transition-all ${
                imagePreviewLoaded ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="relative h-48 w-full">
                  <img
                    src={formData.imageUrl}
                    alt="预览"
                    className="h-full w-full object-cover"
                    onLoad={() => setImagePreviewLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=图片加载失败';
                      setImagePreviewLoaded(true);
                    }}
                  />
                </div>
                <div className="p-3 text-sm text-gray-500">图片预览</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-5 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">保存中...</span>
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            </>
          ) : (
            <>
              <FiSave className="mr-2" /> 保存作品
            </>
          )}
        </button>
      </div>
    </form>
  );
} 