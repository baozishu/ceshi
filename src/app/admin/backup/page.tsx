'use client';

import { useState } from 'react';
import { FiDownload, FiUpload, FiAlertTriangle, FiDatabase, FiFile, FiCheck, FiX } from 'react-icons/fi';

export default function BackupManagement() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      setMessage(null);
      
      const response = await fetch('/api/backup', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('备份失败');
      }
      
      const data = await response.json();
      
      // 创建下载链接
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `backup-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage({ type: 'success', text: '备份成功，文件已下载' });
    } catch (err) {
      console.error('备份失败:', err);
      setMessage({ type: 'error', text: '备份失败，请稍后再试' });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: '请选择备份文件' });
      return;
    }
    
    if (!window.confirm('恢复备份将覆盖所有当前数据，确定要继续吗？')) {
      return;
    }
    
    try {
      setIsRestoring(true);
      setMessage(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/restore', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '恢复失败');
      }
      
      setMessage({ type: 'success', text: '数据恢复成功' });
      setSelectedFile(null);
      
      // 重置文件输入
      const fileInput = document.getElementById('backup-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      console.error('恢复失败:', err);
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '恢复失败，请稍后再试' });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">数据备份与恢复</h1>
        <p className="text-gray-500 mt-1">保护您的网站数据安全</p>
      </div>
      
      {message && (
        <div className={`p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300 animate-fade-in flex items-start ${
          message.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <FiCheck className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <FiX className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <h2 className="flex items-center text-lg font-semibold text-gray-900">
              <FiDownload className="mr-2 text-amber-500" /> 数据备份
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-start mb-4">
              <div className="bg-amber-100 rounded-full p-2 mr-3 flex-shrink-0">
                <FiDatabase className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-600 mb-4">
                  创建所有数据的备份文件，包括用户、作品、项目和友情链接等信息。备份文件将自动下载到您的设备上。
                </p>
                <button
                  onClick={handleBackup}
                  disabled={isBackingUp}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  {isBackingUp ? (
                    <>
                      <span className="mr-2">备份中...</span>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" /> 创建备份
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
            <h2 className="flex items-center text-lg font-semibold text-gray-900">
              <FiUpload className="mr-2 text-red-500" /> 数据恢复
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-5 flex items-start">
              <FiAlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                警告：恢复备份将覆盖所有当前数据。请确保您已经备份了当前数据。
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="bg-red-100 rounded-full p-2 mr-3 flex-shrink-0">
                <FiFile className="h-6 w-6 text-red-600" />
              </div>
              <div className="w-full">
                <div className="mb-4">
                  <label htmlFor="backup-file" className="block text-sm font-medium text-gray-700 mb-2">
                    选择备份文件
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="backup-file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors cursor-pointer border border-gray-200 rounded-lg"
                    />
                    {selectedFile && (
                      <div className="mt-2 text-sm text-gray-500">
                        已选择: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleRestore}
                  disabled={isRestoring || !selectedFile}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    !selectedFile 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transform hover:scale-105'
                  }`}
                >
                  {isRestoring ? (
                    <>
                      <span className="mr-2">恢复中...</span>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-2" /> 恢复数据
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 