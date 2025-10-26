const express = require('express');
const dotenv = require('dotenv');
const app = express();
const PORT = 3000;

// Load environment variables
dotenv.config();

// Middleware (optional: for JSON parsing, logging, etc.)
app.use(express.json());

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

// Example route — profile status
app.get('/profile', (req, res) => {
  res.json({ status: 'active', theme: 'neon-dusk', lastSeen: 'just now' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ COLOSSALTV backend running on port ${PORT}`);
});
