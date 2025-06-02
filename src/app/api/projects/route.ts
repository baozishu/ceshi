import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getProjects, addProject } from '@/lib/db';
import { Project } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// 获取所有项目
export async function GET() {
  try {
    const projects = getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('获取项目失败:', error);
    return NextResponse.json(
      { error: '获取项目失败' },
      { status: 500 }
    );
  }
}

// 添加新项目
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
    if (!data.name || !data.description || !data.imageUrl) {
      return NextResponse.json(
        { error: '项目名称、描述和图片URL为必填项' },
        { status: 400 }
      );
    }
    
    // 创建新项目
    const newProject: Project = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      repoUrl: data.repoUrl || '',
      demoUrl: data.demoUrl || '',
      technologies: data.technologies || [],
      isPinned: data.isPinned || false,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    
    // 添加项目
    const addedProject = addProject(newProject);
    
    return NextResponse.json(addedProject);
  } catch (error) {
    console.error('添加项目失败:', error);
    return NextResponse.json(
      { error: '添加项目失败' },
      { status: 500 }
    );
  }
} 