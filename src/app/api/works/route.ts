import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getWorks, addWork } from '@/lib/db';
import { Work } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// 获取所有作品
export async function GET() {
  try {
    const works = getWorks();
    return NextResponse.json(works);
  } catch (error) {
    console.error('获取作品失败:', error);
    return NextResponse.json(
      { error: '获取作品失败' },
      { status: 500 }
    );
  }
}

// 添加新作品
export async function POST(request: Request) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // 验证必填字段
    if (!data.title || !data.description || !data.imageUrl) {
      return NextResponse.json(
        { error: '标题、描述和图片URL为必填项' },
        { status: 400 }
      );
    }
    
    // 创建新作品
    const newWork: Work = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      link: data.link || '',
      tags: data.tags || [],
      isPinned: data.isPinned || false,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    
    // 添加作品
    const addedWork = addWork(newWork);
    
    return NextResponse.json(addedWork);
  } catch (error) {
    console.error('添加作品失败:', error);
    return NextResponse.json(
      { error: '添加作品失败' },
      { status: 500 }
    );
  }
} 