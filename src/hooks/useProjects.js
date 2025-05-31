import { useQuery } from '@tanstack/react-query';
import projectsData from '../data/projects.json';

const fetchProjects = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  return projectsData;
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
};
