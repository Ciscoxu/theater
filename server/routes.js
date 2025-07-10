const { createServer } = require("http");
const { storage } = require("./storage.js");
const { setupAuth, isAuthenticated } = require("./replitAuth.js");

async function registerRoutes(app) {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Character routes
  app.get("/api/characters", async (req, res) => {
    try {
      const { play } = req.query;
      let characters;
      
      if (play && typeof play === 'string') {
        characters = await storage.getCharactersByPlay(play);
      } else {
        characters = await storage.getCharacters();
      }
      
      res.json(characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.get("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const character = await storage.getCharacter(id);
      
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      res.json(character);
    } catch (error) {
      console.error("Error fetching character:", error);
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // Conversation routes
  app.get("/api/conversations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { characterId } = req.query;
      
      if (!characterId) {
        return res.status(400).json({ message: "Character ID is required" });
      }
      
      const conversation = await storage.getConversation(userId, parseInt(characterId));
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post("/api/conversations", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationData = {
        ...req.body,
        userId
      };
      
      const conversation = await storage.createConversation(conversationData);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.put("/api/conversations/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { messages } = req.body;
      
      const conversation = await storage.updateConversation(id, messages);
      res.json(conversation);
    } catch (error) {
      console.error("Error updating conversation:", error);
      res.status(500).json({ message: "Failed to update conversation" });
    }
  });

  // Script routes
  app.get("/api/scripts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const scripts = await storage.getScripts(userId);
      res.json(scripts);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      res.status(500).json({ message: "Failed to fetch scripts" });
    }
  });

  app.get("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const script = await storage.getScript(id);
      
      if (!script) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.json(script);
    } catch (error) {
      console.error("Error fetching script:", error);
      res.status(500).json({ message: "Failed to fetch script" });
    }
  });

  app.post("/api/scripts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const scriptData = {
        ...req.body,
        userId
      };
      
      const script = await storage.createScript(scriptData);
      res.json(script);
    } catch (error) {
      console.error("Error creating script:", error);
      res.status(500).json({ message: "Failed to create script" });
    }
  });

  app.put("/api/scripts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const script = await storage.updateScript(id, updates);
      res.json(script);
    } catch (error) {
      console.error("Error updating script:", error);
      res.status(500).json({ message: "Failed to update script" });
    }
  });

  // Rehearsal routes
  app.get("/api/rehearsals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const rehearsals = await storage.getRehearsals(userId);
      res.json(rehearsals);
    } catch (error) {
      console.error("Error fetching rehearsals:", error);
      res.status(500).json({ message: "Failed to fetch rehearsals" });
    }
  });

  app.post("/api/rehearsals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const rehearsalData = {
        ...req.body,
        userId
      };
      
      const rehearsal = await storage.createRehearsal(rehearsalData);
      res.json(rehearsal);
    } catch (error) {
      console.error("Error creating rehearsal:", error);
      res.status(500).json({ message: "Failed to create rehearsal" });
    }
  });

  app.put("/api/rehearsals/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const rehearsal = await storage.updateRehearsal(id, updates);
      res.json(rehearsal);
    } catch (error) {
      console.error("Error updating rehearsal:", error);
      res.status(500).json({ message: "Failed to update rehearsal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

module.exports = { registerRoutes };