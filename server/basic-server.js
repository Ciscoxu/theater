const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Import storage
const { storage } = require('./storage.js');

// Mock authentication
const mockAuth = () => ({
  claims: {
    sub: 'demo-user-001',
    email: 'demo@theater.com',
    first_name: '演示',
    last_name: '用户'
  }
});

// Helper to parse JSON body
const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
};

// Helper to send JSON response
const sendJSON = (res, data, statusCode = 200) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Helper to send file
const sendFile = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    }[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
};

const PUBLIC_DIR = path.join(__dirname, '../public');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 只处理 /bg.jpg 这类静态资源，不拦截 /
  if (req.method === 'GET' && pathname !== '/' && pathname.indexOf('.') > -1) {
    const staticFile = path.join(PUBLIC_DIR, pathname);
    if (fs.existsSync(staticFile)) {
      sendFile(res, staticFile);
      return;
    }
  }

  try {
    // API Routes
    if (pathname === '/api/auth/user' && method === 'GET') {
      const user = mockAuth();
      let dbUser = await storage.getUser(user.claims.sub);
      
      if (!dbUser) {
        dbUser = await storage.upsertUser({
          id: user.claims.sub,
          email: user.claims.email,
          firstName: user.claims.first_name,
          lastName: user.claims.last_name,
          profileImageUrl: null
        });
      }
      
      sendJSON(res, dbUser);
      return;
    }
    
    if (pathname === '/api/characters' && method === 'GET') {
      const { play } = parsedUrl.query;
      let characters;
      
      if (play) {
        characters = await storage.getCharactersByPlay(play);
      } else {
        characters = await storage.getCharacters();
      }
      
      sendJSON(res, characters);
      return;
    }
    
    if (pathname.startsWith('/api/characters/') && method === 'GET') {
      const id = parseInt(pathname.split('/')[3]);
      const character = await storage.getCharacter(id);
      
      if (!character) {
        sendJSON(res, { message: 'Character not found' }, 404);
        return;
      }
      
      sendJSON(res, character);
      return;
    }
    
    if (pathname === '/api/conversations' && method === 'GET') {
      const user = mockAuth();
      const { characterId } = parsedUrl.query;
      
      if (!characterId) {
        sendJSON(res, { message: 'Character ID is required' }, 400);
        return;
      }
      
      const conversation = await storage.getConversation(user.claims.sub, parseInt(characterId));
      sendJSON(res, conversation);
      return;
    }
    
    if (pathname === '/api/conversations' && method === 'POST') {
      const user = mockAuth();
      const body = await parseBody(req);
      const conversationData = {
        ...body,
        userId: user.claims.sub
      };
      
      const conversation = await storage.createConversation(conversationData);
      sendJSON(res, conversation);
      return;
    }
    
    if (pathname.startsWith('/api/conversations/') && method === 'PUT') {
      const id = parseInt(pathname.split('/')[3]);
      const body = await parseBody(req);
      const { messages } = body;
      
      const conversation = await storage.updateConversation(id, messages);
      sendJSON(res, conversation);
      return;
    }
    
    if (pathname === '/api/scripts' && method === 'GET') {
      const user = mockAuth();
      const scripts = await storage.getScripts(user.claims.sub);
      sendJSON(res, scripts);
      return;
    }
    
    if (pathname === '/api/scripts' && method === 'POST') {
      const user = mockAuth();
      const body = await parseBody(req);
      const scriptData = {
        ...body,
        userId: user.claims.sub
      };
      
      const script = await storage.createScript(scriptData);
      sendJSON(res, script);
      return;
    }
    
    if (pathname.startsWith('/api/scripts/') && method === 'PUT') {
      const id = parseInt(pathname.split('/')[3]);
      const body = await parseBody(req);
      
      const script = await storage.updateScript(id, body);
      sendJSON(res, script);
      return;
    }
    
    if (pathname === '/api/rehearsals' && method === 'GET') {
      const user = mockAuth();
      const rehearsals = await storage.getRehearsals(user.claims.sub);
      sendJSON(res, rehearsals);
      return;
    }
    
    if (pathname === '/api/rehearsals' && method === 'POST') {
      const user = mockAuth();
      const body = await parseBody(req);
      const rehearsalData = {
        ...body,
        userId: user.claims.sub
      };
      
      const rehearsal = await storage.createRehearsal(rehearsalData);
      sendJSON(res, rehearsal);
      return;
    }
    
    if (pathname.startsWith('/api/rehearsals/') && method === 'PUT') {
      const id = parseInt(pathname.split('/')[3]);
      const body = await parseBody(req);
      
      const rehearsal = await storage.updateRehearsal(id, body);
      sendJSON(res, rehearsal);
      return;
    }
    
    // Auth routes
    if (pathname === '/api/login' || pathname === '/api/logout') {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }
    
    // SPA fallback
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    sendFile(res, indexPath);
    
  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, { message: 'Internal server error' }, 500);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`互动剧场服务器运行在端口 ${PORT}`);
  console.log(`访问 http://localhost:${PORT} 开始使用`);
});

module.exports = server;