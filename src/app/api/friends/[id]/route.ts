import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getFriendLinks, updateFriendLink, deleteFriendLink } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个友情链接
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const friends = getFriendLinks();
    const friend = friends.find(friend => friend.id === id);
    
    if (!friend) {
      return NextResponse.json(
        { error: '友情链接不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(friend);
  } catch (error) {
    console.error('获取友情链接失败:', error);
    return NextResponse.json(
      { error: '获取友情链接失败' },
      { status: 500 }
    );
  }
}

// 更新友情链接
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
    if (!data.name || !data.url || !data.description) {
      return NextResponse.json(
        { error: '网站名称、链接和描述为必填项' },
        { status: 400 }
      );
    }
    
    // 验证URL格式
    try {
      new URL(data.url);
    } catch (err) {
      return NextResponse.json(
        { error: '请输入有效的URL' },
        { status: 400 }
      );
    }
    
    // 更新友情链接
    const updatedFriend = updateFriendLink(id, {
      name: data.name,
      url: data.url,
      description: data.description,
      imageUrl: data.imageUrl,
    });
    
    if (!updatedFriend) {
      return NextResponse.json(
        { error: '友情链接不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedFriend);
  } catch (error) {
    console.error('更新友情链接失败:', error);
    return NextResponse.json(
      { error: '更新友情链接失败' },
      { status: 500 }
    );
  }
}

// 删除友情链接
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
    
    // 删除友情链接
    const isDeleted = deleteFriendLink(id);
    
    if (!isDeleted) {
      return NextResponse.json(
        { error: '友情链接不存在或删除失败' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除友情链接失败:', error);
    return NextResponse.json(
      { error: '删除友情链接失败' },
      { status: 500 }
    );
  }
} 