import { X } from 'lucide-react';
import { useEffect } from 'react';

const Lightbox = ({ project, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90">
      <div className="relative max-w-6xl w-full max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl">
          <img
            src={project.fullSizeUrl}
            alt={project.title}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700">客户</h4>
                <p>{project.client || '未指定'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">日期</h4>
                <p>{project.date}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">分类</h4>
                <p>{project.categories.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">工具</h4>
                <p>{project.tools.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
