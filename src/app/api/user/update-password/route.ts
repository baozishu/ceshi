import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUsers, updateUser } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth';

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
    
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '请提供当前密码和新密码' },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度至少为6个字符' },
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
    
    // 验证当前密码
    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '当前密码不正确' },
        { status: 400 }
      );
    }
    
    // 哈希新密码
    const hashedPassword = await hashPassword(newPassword);
    
    // 更新密码
    const updatedUser = updateUser(user.id, { password: hashedPassword });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: '更新失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '密码更新成功'
    });
  } catch (error) {
    console.error('更新密码失败:', error);
    return NextResponse.json(
      { error: '更新密码时发生错误' },
      { status: 500 }
    );
  }
} 