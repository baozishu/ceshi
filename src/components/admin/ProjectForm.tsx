'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { FiSave, FiX, FiPlus } from 'react-icons/fi';

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (projectData: Partial<Project>) => Promise<void>;
  isSubmitting: boolean;
}

const emptyProject: Partial<Project> = {
  name: '',
  description: '',
  imageUrl: '',
  repoUrl: '',
  demoUrl: '',
  technologies: [],
  isPinned: false,
};

export default function ProjectForm({ initialData, onSubmit, isSubmitting }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>(initialData || emptyProject);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleAddTechnology = () => {
    if (!techInput.trim()) return;
    
    const newTech = techInput.trim();
    if (formData.technologies?.includes(newTech)) {
      setErrors(prev => ({ ...prev, technologies: '技术栈已存在' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      technologies: [...(prev.technologies || []), newTech],
    }));
    setTechInput('');
    setErrors(prev => ({ ...prev, technologies: '' }));
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(tech => tech !== techToRemove) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = '项目名称不能为空';
    }
    if (!formData.description?.trim()) {
      newErrors.description = '项目描述不能为空';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          项目名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.name ? 'border-red-300' : ''
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          项目描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.description ? 'border-red-300' : ''
          }`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          项目图片URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.imageUrl ? 'border-red-300' : ''
          }`}
        />
        {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="预览"
              className="h-32 w-auto object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150?text=图片加载失败';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700">
          代码仓库URL（可选）
        </label>
        <input
          type="text"
          id="repoUrl"
          name="repoUrl"
          value={formData.repoUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700">
          演示地址URL（可选）
        </label>
        <input
          type="text"
          id="demoUrl"
          name="demoUrl"
          value={formData.demoUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">技术栈</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            className="flex-1 min-w-0 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="输入技术名称"
          />
          <button
            type="button"
            onClick={handleAddTechnology}
            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
          >
            <FiPlus className="h-5 w-5" />
          </button>
        </div>
        {errors.technologies && <p className="mt-1 text-sm text-red-600">{errors.technologies}</p>}
        
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.technologies?.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tech}
              <button
                type="button"
                onClick={() => handleRemoveTechnology(tech)}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300"
              >
                <FiX className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="isPinned"
          name="isPinned"
          type="checkbox"
          checked={formData.isPinned}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-900">
          置顶项目
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">保存中...</span>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            </>
          ) : (
            <>
              <FiSave className="mr-2" /> 保存项目
            </>
          )}
        </button>
      </div>
    </form>
  );
} 