// server.js — COLOSSALTV backend

const express = require('express');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables from .env
dotenv.config();

// Middleware to parse JSON
app.use(express.json());

// In-memory profile store (for now)
let profiles = [
  {
    name: 'VIPViewer',
    status: 'active',
    theme: 'neon-dusk',
    lastSeen: 'just now'
  }
];

// Root route — cinematic heartbeat
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>COLOSSALTV</title></head>
      <body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding-top:100px;">
        <h1>🚀 COLOSSALTV backend is live</h1>
        <p>Ready to stream, revoke, and ripple.</p>
      </body>
    </html>
  `);
});

// GET /profile — return first profile
app.get('/profile', (req, res) => {
  res.json(profiles[0]);
});

// POST /profile — add a new profile
app.post('/profile', (req, res) => {
  const { name, theme } = req.body;
  if (!name || !theme) {
    return res.status(400).json({ error: 'Missing name or theme' });
  }

  const newProfile = {
    name,
    status: 'active',
    theme,
    lastSeen: new Date().toLocaleString()
  };

  profiles.push(newProfile);
  console.log(`🆕 Profile added: ${name} with theme ${theme}`);
  res.status(201).json({ message: 'Profile added', profile: newProfile });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ COLOSSALTV backend running on port ${PORT}`);
});
