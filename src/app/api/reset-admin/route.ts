import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { getUsers, updateUser } from '@/lib/db';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    // 获取当前用户列表
    const users = getUsers();
    
    // 找到admin用户
    const adminUser = users.find(user => user.username === 'admin');
    
    if (!adminUser) {
      return NextResponse.json(
        { error: '管理员账号不存在' },
        { status: 404 }
      );
    }
    
    // 生成新密码
    const newPassword = 'admin123';
    const hashedPassword = await hashPassword(newPassword);
    
    // 更新密码
    const updatedUser = updateUser(adminUser.id, { password: hashedPassword });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: '密码重置失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `管理员密码已重置，新密码: ${newPassword}`
    });
  } catch (error) {
    console.error('重置管理员密码失败:', error);
    return NextResponse.json(
      { error: '重置管理员密码失败' },
      { status: 500 }
    );
  }
} 