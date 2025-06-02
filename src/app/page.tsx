import WorkCard from '@/components/works/WorkCard';
import ProjectCard from '@/components/projects/ProjectCard';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { Work, Project, FriendLink } from '@/lib/types';

async function getWorks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/works`, { cache: 'no-store' });
  if (!res.ok) throw new Error('获取作品数据失败');
  return res.json();
}

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects`, { cache: 'no-store' });
  if (!res.ok) throw new Error('获取项目数据失败');
  return res.json();
}

async function getFriendLinks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/friends`, { cache: 'no-store' });
  if (!res.ok) throw new Error('获取友情链接数据失败');
  return res.json();
}

export default async function Home() {
  // 获取数据
  const [allWorks, allProjects, friendLinks] = await Promise.all([
    getWorks(),
    getProjects(),
    getFriendLinks()
  ]);

  // 处理数据展示
  const pinnedWorks = allWorks.filter((work: Work) => work.isPinned);
  const recentWorks = allWorks
    .sort((a: Work, b: Work) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  
  const featuredProjects = allProjects
    .sort((a: Project, b: Project) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* 英雄区域 */}
      <section className="max-w-7xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">个人作品与项目</span>
          <span className="block text-blue-600">创意与技术的展示</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
          欢迎来到我的个人作品集，这里展示了我的创作成果和技术项目
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link 
            href="/works" 
            className="rounded-md bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
          >
            浏览作品
          </Link>
          <Link 
            href="/projects" 
            className="rounded-md bg-gray-100 px-4 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-200"
          >
            查看项目
          </Link>
        </div>
      </section>

      {/* 置顶作品区域 */}
      {pinnedWorks.length > 0 && (
        <section className="max-w-7xl mx-auto py-12">
          <div className="border-l-4 border-blue-600 pl-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">置顶作品</h2>
            <p className="text-gray-600 mt-1">精选推荐的作品展示</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pinnedWorks.map((work: Work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      )}

      {/* 最新作品区域 */}
      <section className="max-w-7xl mx-auto py-12">
        <div className="flex justify-between items-end mb-8">
          <div className="border-l-4 border-blue-600 pl-4">
            <h2 className="text-3xl font-bold text-gray-900">最新作品</h2>
            <p className="text-gray-600 mt-1">近期添加的作品</p>
          </div>
          <Link 
            href="/works" 
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
            查看全部 <FiArrowRight className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentWorks.map((work: Work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </section>

      {/* 项目展示区域 */}
      <section className="max-w-7xl mx-auto py-12">
        <div className="flex justify-between items-end mb-8">
          <div className="border-l-4 border-blue-600 pl-4">
            <h2 className="text-3xl font-bold text-gray-900">项目展示</h2>
            <p className="text-gray-600 mt-1">我的开发项目</p>
          </div>
          <Link 
            href="/projects" 
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部 <FiArrowRight className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 友情链接区域 */}
      {friendLinks.length > 0 && (
        <section className="max-w-7xl mx-auto py-12">
          <div className="border-l-4 border-blue-600 pl-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">友情链接</h2>
            <p className="text-gray-600 mt-1">合作伙伴与朋友</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {friendLinks.map((link: FriendLink) => (
              <a
                key={link.id}
                href={link.url}
          target="_blank"
          rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                {link.imageUrl && (
                  <div className="w-12 h-12 mb-3 relative">
                    <img 
                      src={link.imageUrl} 
                      alt={link.name} 
                      className="rounded-full object-cover"
                      width={48}
                      height={48}
          />
                  </div>
                )}
                <span className="text-gray-900 font-medium text-sm">{link.name}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
