import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUsers, updateUser } from '@/lib/db';

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
    
    const { name } = await request.json();
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: '名称不能为空' },
        { status: 400 }
      );
    }
    
    // 获取用户
    const users = getUsers();
    const user = users.find(u => u.username === session.user.username);
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 更新用户名称
    const updatedUser = updateUser(user.id, { name: name.trim() });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: '更新失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '名称更新成功'
    });
  } catch (error) {
    console.error('更新名称失败:', error);
    return NextResponse.json(
      { error: '更新名称时发生错误' },
      { status: 500 }
    );
  }
} 