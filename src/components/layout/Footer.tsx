import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { getConfig } from '@/lib/db';

const Footer = async () => {
  const config = getConfig();
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 网站信息 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {config.title}
            </h3>
            <p className="text-gray-500 text-sm">
              {config.description}
            </p>
          </div>
          
          {/* 快速链接 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">快速链接</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                首页
              </Link>
              <Link href="/works" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                作品
              </Link>
              <Link href="/projects" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                项目
              </Link>
            </nav>
          </div>
          
          {/* 社交媒体 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">联系方式</h3>
            <div className="flex space-x-4">
              {config.social.github && (
                <a 
                  href={config.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="GitHub"
                >
                  <FiGithub size={20} />
                </a>
              )}
              {config.social.twitter && (
                <a 
                  href={config.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="Twitter"
                >
                  <FiTwitter size={20} />
                </a>
              )}
              {config.social.linkedin && (
                <a 
                  href={config.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin size={20} />
                </a>
              )}
              {config.social.email && (
                <a 
                  href={`mailto:${config.social.email}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="Email"
                >
                  <FiMail size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            {config.footer.replace(/\d{4}/g, year.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 