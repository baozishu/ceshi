import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUsers, getWorks, getProjects, getFriendLinks, getConfig } from '@/lib/db';

export async function POST() {
  try {
    // 验证用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 获取所有数据
    const backupData = {
      users: getUsers(),
      works: getWorks(),
      projects: getProjects(),
      friendLinks: getFriendLinks(),
      config: getConfig(),
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(backupData);
  } catch (error) {
    console.error('备份数据失败:', error);
    return NextResponse.json(
      { error: '备份数据失败' },
      { status: 500 }
    );
  }
} 