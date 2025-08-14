export interface ContentItem {
  id: string;
  content: string;
  timestamp: string;
}

export interface StorageData {
  [key: string]: ContentItem;
}
