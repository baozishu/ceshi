'use client';

import Image from 'next/image';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* 项目图片 */}
      <div className="relative h-48">
        <Image
          src={project.imageUrl}
          alt={project.name}
          fill
          className="object-cover"
        />
      </div>

      {/* 项目内容 */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {project.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* 技术栈 */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* 链接 */}
        <div className="mt-4 flex gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiExternalLink className="mr-2" />
              查看演示
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiGithub className="mr-2" />
              查看代码
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 