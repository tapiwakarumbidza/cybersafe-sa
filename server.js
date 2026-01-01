/**
 * Local Development Server
 * Serves both Vite frontend and API routes without requiring Vercel login
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(express.json());

// Import API handlers
import calculateRisk from './api/calculate-risk.js';
import dnsCheck from './api/dns-check.js';
import health from './api/health.js';

// API routes
app.post('/api/calculate-risk', (req, res) => calculateRisk(req, res));
app.post('/api/dns-check', (req, res) => dnsCheck(req, res));
app.get('/api/health', (req, res) => health(req, res));

// Start server
async function startServer() {
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`\n🚀 CyberSafe-SA Development Server`);
    console.log(`   Local:   http://localhost:${PORT}/`);
    console.log(`   API:     http://localhost:${PORT}/api/*\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
