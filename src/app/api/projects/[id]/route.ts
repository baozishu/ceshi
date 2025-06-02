import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getProjects, updateProject, deleteProject } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个项目
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const projects = getProjects();
    const project = projects.find(project => project.id === id);
    
    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('获取项目失败:', error);
    return NextResponse.json(
      { error: '获取项目失败' },
      { status: 500 }
    );
  }
}

// 更新项目
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const data = await request.json();
    
    // 验证必填字段
    if (!data.name || !data.description) {
      return NextResponse.json(
        { error: '项目名称和描述为必填项' },
        { status: 400 }
      );
    }
    
    // 更新项目
    const updatedProject = updateProject(id, {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      repoUrl: data.repoUrl,
      demoUrl: data.demoUrl,
      technologies: data.technologies,
      isPinned: data.isPinned,
    });
    
    if (!updatedProject) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('更新项目失败:', error);
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    );
  }
}

// 部分更新项目（例如置顶状态）
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const data = await request.json();
    
    // 更新项目
    const updatedProject = updateProject(id, data);
    
    if (!updatedProject) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('更新项目失败:', error);
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    );
  }
}

// 删除项目
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // 删除项目
    const isDeleted = deleteProject(id);
    
    if (!isDeleted) {
      return NextResponse.json(
        { error: '项目不存在或删除失败' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除项目失败:', error);
    return NextResponse.json(
      { error: '删除项目失败' },
      { status: 500 }
    );
  }
} 