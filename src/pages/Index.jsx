import { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import FilterBar from '../components/FilterBar';
import Lightbox from '../components/Lightbox';
import FriendLinksSection from '../components/FriendLinksSection';
import { useProjects } from '../hooks/useProjects';

const Index = () => {
  const { data, isLoading, error } = useProjects();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>加载作品中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>加载作品失败，请稍后重试</p>
        </div>
      </div>
    );
  }

  const filteredProjects = activeFilter === 'all'
    ? data.projects
    : data.projects.filter(project => 
        project.categories.some(cat => 
          data.categories.find(c => c.name === cat)?.id === activeFilter
        )
      );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">作品集</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            展示我们的创意成果和专业设计解决方案
          </p>
        </div>

        <div className="flex justify-center">
          <FilterBar 
            categories={data.categories} 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onClick={setSelectedProject}
            />
          ))}
        </div>

        <FriendLinksSection />

        {selectedProject && (
          <Lightbox 
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
