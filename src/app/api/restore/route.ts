import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeData } from '@/lib/db';
import path from 'path';
import fs from 'fs';

// 数据路径
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const WORKS_FILE = path.join(DATA_DIR, 'works.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const FRIENDS_FILE = path.join(DATA_DIR, 'friends.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

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
    
    // 解析表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '未提供备份文件' },
        { status: 400 }
      );
    }
    
    // 读取文件内容
    const fileContent = await file.text();
    
    try {
      const backupData = JSON.parse(fileContent);
      
      // 验证备份数据格式
      if (!backupData.users || !backupData.works || !backupData.projects || 
          !backupData.friendLinks || !backupData.config) {
        throw new Error('备份文件格式无效');
      }
      
      // 恢复数据
      writeData(USERS_FILE, backupData.users);
      writeData(WORKS_FILE, backupData.works);
      writeData(PROJECTS_FILE, backupData.projects);
      writeData(FRIENDS_FILE, backupData.friendLinks);
      writeData(CONFIG_FILE, backupData.config);
      
      return NextResponse.json({ success: true });
    } catch (parseError) {
      console.error('解析备份文件失败:', parseError);
      return NextResponse.json(
        { error: '备份文件格式无效' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('恢复数据失败:', error);
    return NextResponse.json(
      { error: '恢复数据失败' },
      { status: 500 }
    );
  }
} 