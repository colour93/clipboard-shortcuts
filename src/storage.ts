import * as fs from 'fs';
import * as path from 'path';
import { ContentItem, StorageData } from './types';

const DATA_FILE = path.join(__dirname, '../data/storage.json');

export class StorageService {
  private ensureDataDirectory(): void {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  private loadData(): StorageData {
    this.ensureDataDirectory();
    
    if (!fs.existsSync(DATA_FILE)) {
      return {};
    }

    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取存储文件失败:', error);
      return {};
    }
  }

  private saveData(data: StorageData): void {
    this.ensureDataDirectory();
    
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('保存存储文件失败:', error);
      throw new Error('保存数据失败');
    }
  }

  public setContent(id: string, content: string): ContentItem {
    const data = this.loadData();
    
    const item: ContentItem = {
      id,
      content,
      timestamp: new Date().toISOString()
    };

    data[id] = item;
    this.saveData(data);
    
    return item;
  }

  public getContent(id: string): ContentItem | null {
    const data = this.loadData();
    return data[id] || null;
  }

  public getAllContent(): ContentItem[] {
    const data = this.loadData();
    return Object.values(data);
  }
}
