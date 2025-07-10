const express = require("express");
const { join } = require("path");
const { registerRoutes } = require("./routes.js");

const app = express();
app.use(express.json());

// Serve static files from client/dist
app.use(express.static(join(__dirname, "../client/dist")));

// Register API routes and start server
async function startServer() {
  const httpServer = await registerRoutes(app);
  
  // Serve index.html for all other routes (SPA)
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../client/dist/index.html"));
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);