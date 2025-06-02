import fs from 'fs';
import path from 'path';
import { User, Work, Project, FriendLink, SiteConfig } from './types';

// 数据路径
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const WORKS_FILE = path.join(DATA_DIR, 'works.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const FRIENDS_FILE = path.join(DATA_DIR, 'friends.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化文件（如果不存在）
const initFile = (filePath: string, defaultData: any) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// 初始化所有数据文件
export const initDataFiles = () => {
  initFile(USERS_FILE, []);
  initFile(WORKS_FILE, []);
  initFile(PROJECTS_FILE, []);
  initFile(FRIENDS_FILE, []);
  initFile(CONFIG_FILE, {
    title: '个人作品集',
    description: '我的作品和项目展示',
    footer: '© 2023 个人作品集',
    theme: 'system',
    social: {}
  });
};

// 读取数据
export const readData = <T>(filePath: string): T => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
};

// 写入数据
export const writeData = <T>(filePath: string, data: T): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw error;
  }
};

// 用户数据操作
export const getUsers = (): User[] => {
  return readData<User[]>(USERS_FILE);
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

export const addUser = (user: User): User => {
  const users = getUsers();
  const newUsers = [...users, user];
  writeData(USERS_FILE, newUsers);
  return user;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) return null;
  
  const updatedUser = { ...users[userIndex], ...userData };
  users[userIndex] = updatedUser;
  writeData(USERS_FILE, users);
  
  return updatedUser;
};

// 作品数据操作
export const getWorks = (): Work[] => {
  return readData<Work[]>(WORKS_FILE);
};

export const addWork = (work: Work): Work => {
  const works = getWorks();
  const newWorks = [...works, work];
  writeData(WORKS_FILE, newWorks);
  return work;
};

export const updateWork = (id: string, workData: Partial<Work>): Work | null => {
  const works = getWorks();
  const workIndex = works.findIndex(work => work.id === id);
  
  if (workIndex === -1) return null;
  
  const updatedWork = { ...works[workIndex], ...workData };
  works[workIndex] = updatedWork;
  writeData(WORKS_FILE, works);
  
  return updatedWork;
};

export const deleteWork = (id: string): boolean => {
  const works = getWorks();
  const newWorks = works.filter(work => work.id !== id);
  
  if (newWorks.length === works.length) return false;
  
  writeData(WORKS_FILE, newWorks);
  return true;
};

// 项目数据操作
export const getProjects = (): Project[] => {
  return readData<Project[]>(PROJECTS_FILE);
};

export const addProject = (project: Project): Project => {
  const projects = getProjects();
  const newProjects = [...projects, project];
  writeData(PROJECTS_FILE, newProjects);
  return project;
};

export const updateProject = (id: string, projectData: Partial<Project>): Project | null => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(project => project.id === id);
  
  if (projectIndex === -1) return null;
  
  const updatedProject = { ...projects[projectIndex], ...projectData };
  projects[projectIndex] = updatedProject;
  writeData(PROJECTS_FILE, projects);
  
  return updatedProject;
};

export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const newProjects = projects.filter(project => project.id !== id);
  
  if (newProjects.length === projects.length) return false;
  
  writeData(PROJECTS_FILE, newProjects);
  return true;
};

// 友情链接数据操作
export const getFriendLinks = (): FriendLink[] => {
  return readData<FriendLink[]>(FRIENDS_FILE);
};

export const addFriendLink = (friendLink: FriendLink): FriendLink => {
  const friendLinks = getFriendLinks();
  const newFriendLinks = [...friendLinks, friendLink];
  writeData(FRIENDS_FILE, newFriendLinks);
  return friendLink;
};

export const updateFriendLink = (id: string, linkData: Partial<FriendLink>): FriendLink | null => {
  const friendLinks = getFriendLinks();
  const linkIndex = friendLinks.findIndex(link => link.id === id);
  
  if (linkIndex === -1) return null;
  
  const updatedLink = { ...friendLinks[linkIndex], ...linkData };
  friendLinks[linkIndex] = updatedLink;
  writeData(FRIENDS_FILE, friendLinks);
  
  return updatedLink;
};

export const deleteFriendLink = (id: string): boolean => {
  const friendLinks = getFriendLinks();
  const initialLength = friendLinks.length;
  const newFriendLinks = friendLinks.filter(link => link.id !== id);
  
  if (newFriendLinks.length === initialLength) {
    return false;
  }
  
  writeData(FRIENDS_FILE, newFriendLinks);
  return true;
};

// 站点配置数据操作
export const getConfig = (): SiteConfig => {
  return readData<SiteConfig>(CONFIG_FILE);
};

export const updateConfig = (configData: Partial<SiteConfig>): SiteConfig => {
  const config = getConfig();
  const updatedConfig = { ...config, ...configData };
  writeData(CONFIG_FILE, updatedConfig);
  return updatedConfig;
};

// 数据备份
export const backupData = (): string => {
  const backupDir = path.join(DATA_DIR, 'backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
  
  const backupData = {
    users: getUsers(),
    works: getWorks(),
    projects: getProjects(),
    friendLinks: getFriendLinks(),
    config: getConfig()
  };
  
  writeData(backupFile, backupData);
  return backupFile;
};

// 恢复数据
export const restoreData = (backupFilePath: string): boolean => {
  try {
    const backupData = readData<{
      users: User[];
      works: Work[];
      projects: Project[];
      friendLinks: FriendLink[];
      config: SiteConfig;
    }>(backupFilePath);
    
    writeData(USERS_FILE, backupData.users);
    writeData(WORKS_FILE, backupData.works);
    writeData(PROJECTS_FILE, backupData.projects);
    writeData(FRIENDS_FILE, backupData.friendLinks);
    writeData(CONFIG_FILE, backupData.config);
    
    return true;
  } catch (error) {
    console.error('Error restoring data:', error);
    return false;
  }
}; 