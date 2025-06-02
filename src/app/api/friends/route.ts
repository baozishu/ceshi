import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getFriendLinks, addFriendLink } from '@/lib/db';
import { FriendLink } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// 获取所有友情链接
export async function GET() {
  try {
    const friends = getFriendLinks();
    return NextResponse.json(friends);
  } catch (error) {
    console.error('获取友情链接失败:', error);
    return NextResponse.json(
      { error: '获取友情链接失败' },
      { status: 500 }
    );
  }
}

// 添加新友情链接
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
    
    // 创建新友情链接
    const newFriend: FriendLink = {
      id: uuidv4(),
      name: data.name,
      url: data.url,
      description: data.description,
      imageUrl: data.imageUrl || undefined,
    };
    
    // 添加友情链接
    const addedFriend = addFriendLink(newFriend);
    
    return NextResponse.json(addedFriend);
  } catch (error) {
    console.error('添加友情链接失败:', error);
    return NextResponse.json(
      { error: '添加友情链接失败' },
      { status: 500 }
    );
  }
} 