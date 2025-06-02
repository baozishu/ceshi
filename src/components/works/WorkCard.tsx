'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiEye, FiTag } from 'react-icons/fi';
import { Work } from '@/lib/types';

interface WorkCardProps {
  work: Work;
}

const WorkCard = ({ work }: WorkCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* 作品图片 */}
      <div className="relative h-48">
        <Image
          src={work.imageUrl}
          alt={work.title}
          fill
          className="object-cover"
        />
        {work.isPinned && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            置顶
          </div>
        )}
      </div>

      {/* 作品内容 */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {work.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {work.description}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
            >
              <FiTag className="mr-1" size={12} />
              {tag}
            </span>
          ))}
        </div>

        {/* 查看按钮 */}
        <div className="mt-4">
          <Link
            href={work.link || `/works/${work.id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full"
            target={work.link ? '_blank' : '_self'}
            rel={work.link ? 'noopener noreferrer' : ''}
          >
            <FiEye className="mr-2" />
            查看作品
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkCard; 