import express from 'express';
import cors from 'cors';
import path from 'path';
import { StorageService } from './storage';

const app = express();
const port = process.env.PORT || 25939;
const storageService = new StorageService();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API 路由
// 设置内容
app.post('/api/content', (req, res) => {
  try {
    const { id, content } = req.body;

    if (!id || !content) {
      return res.status(400).json({
        error: 'ID 和内容都是必需的'
      });
    }

    const item = storageService.setContent(id, content);
    res.json({
      success: true,
      data: item,
      message: '内容设置成功'
    });
  } catch (error) {
    console.error('设置内容失败:', error);
    res.status(500).json({
      error: '服务器内部错误'
    });
  }
});

// 通过 ID 查询内容
app.get('/api/content/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = storageService.getContent(id);

    if (!item) {
      return res.status(404).json({
        error: '未找到指定 ID 的内容'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('查询内容失败:', error);
    res.status(500).json({
      error: '服务器内部错误'
    });
  }
});

// 获取所有内容（可选功能）
app.get('/api/content', (req, res) => {
  try {
    const items = storageService.getAllContent();
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('获取所有内容失败:', error);
    res.status(500).json({
      error: '服务器内部错误'
    });
  }
});

// 提供前端页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
