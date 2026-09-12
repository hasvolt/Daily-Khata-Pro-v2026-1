import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Explicit route for Google AdSense ads.txt verification
  app.get('/ads.txt', (req, res) => {
    const adsPath = path.join(process.cwd(), 'public', 'ads.txt');
    if (fs.existsSync(adsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.sendFile(adsPath);
    } else {
      res.type('text/plain').send('google.com, pub-4744063610455678, DIRECT, f08c47fec0942fa0\n');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static files from dist
    const distPath = path.join(__dirname, '..', 'dist');
    
    // Check if dist exists (handle case where server.cjs is inside dist or outside)
    const servePath = fs.existsSync(distPath) ? distPath : path.join(__dirname, 'dist');
    
    app.use(express.static(servePath));
    
    // SPA Fallback
    app.get('*all', (req, res) => {
      res.sendFile(path.join(servePath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
