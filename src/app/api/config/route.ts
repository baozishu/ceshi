import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getConfig, updateConfig } from '@/lib/db';

// 获取配置
export async function GET() {
  try {
    const config = getConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('获取配置失败:', error);
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    );
  }
}

// 更新配置
export async function PUT(request: Request) {
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
    if (!data.title || !data.description || !data.footer) {
      return NextResponse.json(
        { error: '网站标题、描述和页脚为必填项' },
        { status: 400 }
      );
    }
    
    // 验证主题
    if (!['light', 'dark', 'system'].includes(data.theme)) {
      return NextResponse.json(
        { error: '主题值无效' },
        { status: 400 }
      );
    }
    
    // 更新配置
    const updatedConfig = updateConfig({
      title: data.title,
      description: data.description,
      logo: data.logo,
      footer: data.footer,
      theme: data.theme,
      social: data.social || {},
    });
    
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('更新配置失败:', error);
    return NextResponse.json(
      { error: '更新配置失败' },
      { status: 500 }
    );
  }
} 