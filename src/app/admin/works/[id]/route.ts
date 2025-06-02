import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getWorks, updateWork, deleteWork } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个作品
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const works = getWorks();
    const work = works.find(work => work.id === id);
    
    if (!work) {
      return NextResponse.json(
        { error: '作品不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(work);
  } catch (error) {
    console.error('获取作品失败:', error);
    return NextResponse.json(
      { error: '获取作品失败' },
      { status: 500 }
    );
  }
}

// 更新作品
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
    if (!data.title || !data.description || !data.imageUrl) {
      return NextResponse.json(
        { error: '标题、描述和图片URL为必填项' },
        { status: 400 }
      );
    }
    
    // 更新作品
    const updatedWork = updateWork(id, {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      link: data.link,
      tags: data.tags,
      isPinned: data.isPinned,
    });
    
    if (!updatedWork) {
      return NextResponse.json(
        { error: '作品不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedWork);
  } catch (error) {
    console.error('更新作品失败:', error);
    return NextResponse.json(
      { error: '更新作品失败' },
      { status: 500 }
    );
  }
}

// 部分更新作品（例如置顶状态）
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
    
    // 更新作品
    const updatedWork = updateWork(id, data);
    
    if (!updatedWork) {
      return NextResponse.json(
        { error: '作品不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedWork);
  } catch (error) {
    console.error('更新作品失败:', error);
    return NextResponse.json(
      { error: '更新作品失败' },
      { status: 500 }
    );
  }
}

// 删除作品
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
    
    // 删除作品
    const isDeleted = deleteWork(id);
    
    if (!isDeleted) {
      return NextResponse.json(
        { error: '作品不存在或删除失败' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除作品失败:', error);
    return NextResponse.json(
      { error: '删除作品失败' },
      { status: 500 }
    );
  }
} 