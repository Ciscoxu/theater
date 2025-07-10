const express = require('express');
const path = require('path');
const { storage } = require('./storage.js');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  req.user = {
    claims: {
      sub: 'demo-user-001',
      email: 'demo@theater.com',
      first_name: '演示',
      last_name: '用户'
    }
  };
  next();
};

// Simple routing without parameters to avoid path-to-regexp issues
app.get('/api/auth/user', mockAuth, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    let user = await storage.getUser(userId);
    
    if (!user) {
      user = await storage.upsertUser({
        id: userId,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: null
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

app.get('/api/characters', async (req, res) => {
  try {
    const { play } = req.query;
    let characters;
    
    if (play) {
      characters = await storage.getCharactersByPlay(play);
    } else {
      characters = await storage.getCharacters();
    }
    
    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ message: 'Failed to fetch characters' });
  }
});

// Handle character by ID with manual parsing
app.get('/api/characters/*', async (req, res) => {
  try {
    const pathParts = req.path.split('/');
    const id = parseInt(pathParts[pathParts.length - 1]);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid character ID' });
    }
    
    const character = await storage.getCharacter(id);
    
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    res.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ message: 'Failed to fetch character' });
  }
});

app.get('/api/conversations', mockAuth, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { characterId } = req.query;
    
    if (!characterId) {
      return res.status(400).json({ message: 'Character ID is required' });
    }
    
    const conversation = await storage.getConversation(userId, parseInt(characterId));
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
});

app.post('/api/conversations', mockAuth, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const conversationData = {
      ...req.body,
      userId
    };
    
    const conversation = await storage.createConversation(conversationData);
    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});

// Handle conversation updates with manual parsing
app.put('/api/conversations/*', mockAuth, async (req, res) => {
  try {
    const pathParts = req.path.split('/');
    const id = parseInt(pathParts[pathParts.length - 1]);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }
    
    const { messages } = req.body;
    const conversation = await storage.updateConversation(id, messages);
    res.json(conversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({ message: 'Failed to update conversation' });
  }
});

app.get('/api/scripts', mockAuth, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const scripts = await storage.getScripts(userId);
    res.json(scripts);
  } catch (error) {
    console.error('Error fetching scripts:', error);
    res.status(500).json({ message: 'Failed to fetch scripts' });
  }
});

app.post('/api/scripts', mockAuth, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const scriptData = {
      ...req.body,
      userId
    };
    
    const script = await storage.createScript(scriptData);
    res.json(script);
  } catch (error) {
    console.error('Error creating script:', error);
    res.status(500).json({ message: 'Failed to create script' });
  }
});

// Handle script updates with manual parsing
app.put('/api/scripts/*', mockAuth, async (req, res) => {
  try {
    const pathParts = req.path.split('/');
    const id = parseInt(pathParts[pathParts.length - 1]);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid script ID' });
    }
    
    const updates = req.body;
    const script = await storage.updateScript(id, updates);
    res.json(script);
  } catch (error) {
    console.error('Error updating script:', error);
    res.status(500).json({ message: 'Failed to update script' });
  }
});

app.get('/api/rehearsals', mockAuth, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const rehearsals = await storage.getRehearsals(userId);
    res.json(rehearsals);
  } catch (error) {
    console.error('Error fetching rehearsals:', error);
    res.status(500).json({ message: 'Failed to fetch rehearsals' });
  }
});

app.post('/api/rehearsals', mockAuth, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const rehearsalData = {
      ...req.body,
      userId
    };
    
    const rehearsal = await storage.createRehearsal(rehearsalData);
    res.json(rehearsal);
  } catch (error) {
    console.error('Error creating rehearsal:', error);
    res.status(500).json({ message: 'Failed to create rehearsal' });
  }
});

// Handle rehearsal updates with manual parsing
app.put('/api/rehearsals/*', mockAuth, async (req, res) => {
  try {
    const pathParts = req.path.split('/');
    const id = parseInt(pathParts[pathParts.length - 1]);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid rehearsal ID' });
    }
    
    const updates = req.body;
    const rehearsal = await storage.updateRehearsal(id, updates);
    res.json(rehearsal);
  } catch (error) {
    console.error('Error updating rehearsal:', error);
    res.status(500).json({ message: 'Failed to update rehearsal' });
  }
});

// Authentication routes
app.get('/api/login', (req, res) => {
  res.redirect('/');
});

app.get('/api/logout', (req, res) => {
  res.redirect('/');
});

// Serve SPA - this should be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`互动剧场服务器运行在端口 ${PORT}`);
  console.log(`访问 http://localhost:${PORT} 开始使用`);
});

module.exports = app;