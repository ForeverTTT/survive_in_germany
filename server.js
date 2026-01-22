import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const SAVE_DIR = path.join(__dirname, 'saves');

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API routes
  if (req.url === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        // 1. Save main progress (includes stats, npcs, mailbox, album, diary)
        fs.writeFileSync(path.join(SAVE_DIR, 'progress', 'save.json'), JSON.stringify(data, null, 2));
        
        // 2. Save individual diary entries as TXT
        if (data.stats && data.stats.diary) {
          const diaryDir = path.join(SAVE_DIR, 'diaries');
          const currentIds = data.stats.diary.map(e => e.id);
          data.stats.diary.forEach(entry => {
            const fileName = `${entry.id}.txt`;
            const content = `Date: ${new Date(entry.timestamp).toLocaleString()}\nMood: ${entry.mood}\nChapter: ${entry.chapter}, Level: ${entry.level}\nLocation: ${entry.location}\n\nContent:\n${entry.content}`;
            fs.writeFileSync(path.join(diaryDir, fileName), content);
          });
          const existingFiles = fs.readdirSync(diaryDir);
          existingFiles.forEach(file => {
            if (file.endsWith('.txt')) {
              const id = file.replace('.txt', '');
              if (!currentIds.includes(id)) fs.unlinkSync(path.join(diaryDir, file));
            }
          });
        }

        // 3. Save achievements and settings separately for extra safety
        if (data.globalAchievements) {
          fs.writeFileSync(path.join(SAVE_DIR, 'progress', 'achievements.json'), JSON.stringify(data.globalAchievements, null, 2));
        }
        if (data.settings) {
          fs.writeFileSync(path.join(SAVE_DIR, 'progress', 'settings.json'), JSON.stringify(data.settings, null, 2));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (req.url === '/api/reset' && req.method === 'POST') {
    try {
      const deleteFolderRecursive = (folderPath) => {
        if (fs.existsSync(folderPath)) {
          fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
              deleteFolderRecursive(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          });
        }
      };
      // 只清空内容，保留目录结构
      deleteFolderRecursive(path.join(SAVE_DIR, 'diaries'));
      deleteFolderRecursive(path.join(SAVE_DIR, 'progress'));
      deleteFolderRecursive(path.join(SAVE_DIR, 'mailbox'));
      deleteFolderRecursive(path.join(SAVE_DIR, 'album'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  } else if (req.url === '/api/load' && req.method === 'GET') {
    try {
      const progressPath = path.join(SAVE_DIR, 'progress', 'save.json');
      const diaryDir = path.join(SAVE_DIR, 'diaries');
      
      let data = {};
      if (fs.existsSync(progressPath)) {
        data = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
      }

      // 核心改进：从物理 .txt 文件同步回内存，允许手动修改
      if (fs.existsSync(diaryDir)) {
        const diaryFiles = fs.readdirSync(diaryDir).filter(f => f.endsWith('.txt'));
        const physicalDiaries = diaryFiles.map(file => {
          const content = fs.readFileSync(path.join(diaryDir, file), 'utf8');
          const id = file.replace('.txt', '');
          const lines = content.split('\n');
          
          // 解析记事本格式
          const moodLine = lines.find(l => l.startsWith('Mood: '));
          const mood = moodLine ? moodLine.replace('Mood: ', '').trim() : 'neutral';
          
          const chapterLine = lines.find(l => l.startsWith('Chapter: '));
          let chapter = 1, level = 1;
          if (chapterLine) {
            const parts = chapterLine.split(', ');
            chapter = parseInt(parts[0].replace('Chapter: ', '')) || 1;
            level = parseInt(parts[1].replace('Level: ', '')) || 1;
          }

          const locationLine = lines.find(l => l.startsWith('Location: '));
          const location = locationLine ? locationLine.replace('Location: ', '').trim() : '';

          const contentStart = content.indexOf('Content:\n');
          const textContent = contentStart !== -1 ? content.substring(contentStart + 9).trim() : '';
          
          return {
            id,
            content: textContent,
            mood: mood,
            chapter,
            level,
            location,
            timestamp: parseInt(id.split('_')[1]) || Date.now()
          };
        });

        if (data.stats) {
          // 合并逻辑：以物理文件为准
          data.stats.diary = physicalDiaries.sort((a, b) => b.timestamp - a.timestamp);
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      console.error("Load error:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️  Port ${PORT} is already in use. Another server might be running.`);
    console.error(`   Please close other instances or run: taskkill /F /IM node.exe`);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`✅ Save server running at http://localhost:${PORT}`);
});
