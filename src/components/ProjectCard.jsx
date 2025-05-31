import { useState } from 'react';
import { ZoomIn, ExternalLink, CalendarDays, User, Wrench } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full border border-gray-100 hover:border-blue-100">
      <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
        <img
          src={project.coverUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onClick={() => onClick(project)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 mb-1 text-sm">
              <User className="w-4 h-4" />
              <span>{project.client || '未指定客户'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4" />
              <span>{new Date(project.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 p-1.5 bg-black/30 rounded-full" />
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.title}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Wrench className="w-3 h-3" />
            <span>{project.tools.length}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.categories.map(category => (
            <span 
              key={category} 
              className="px-2.5 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-medium"
            >
              {category}
            </span>
          ))}
        </div>
        
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            alert(`即将访问项目: ${project.title}`);
          }}
        >
          <ExternalLink className="w-4 h-4" />
          查看详情
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
