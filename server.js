const express = require('express');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());

// In-memory profile store
let profiles = [
  {
    name: 'VIPViewer',
    status: 'active',
    theme: 'neon-dusk',
    lastSeen: new Date().toLocaleString(),
    app: 'Stremio'
  },
  {
    name: 'MascotReveal',
    status: 'revoked',
    theme: 'midnight-glow',
    lastSeen: 'Oct 25, 11:03 AM',
    app: 'Kodi'
  }
];

// Root route
app.get('/', (req, res) => {
  res.send(`<h1>🚀 COLOSSALTV backend is live</h1>`);
});

// GET all profiles
app.get('/profiles', (req, res) => {
  res.json(profiles);
});

// GET single profile by name
app.get('/profile/:name', (req, res) => {
  const profile = profiles.find(p => p.name === req.params.name);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile);
});

// POST /profile — Add new profile
app.post('/profile', (req, res) => {
  const { name, theme } = req.body;
  if (!name || !theme) {
    return res.status(400).json({ error: 'Missing name or theme' });
  }

  const newProfile = {
    name,
    status: 'active',
    theme,
    lastSeen: new Date().toLocaleString(),
    app: 'Unknown'
  };

  profiles.push(newProfile);
  res.status(201).json({ message: 'Profile added', profile: newProfile });
});

// DELETE /profile/:name — Delete profile
app.delete('/profile/:name', (req, res) => {
  const index = profiles.findIndex(p => p.name === req.params.name);
  if (index === -1) return res.status(404).json({ error: 'Profile not found' });

  const removed = profiles.splice(index, 1);
  res.json({ message: 'Profile deleted', profile: removed[0] });
});

// POST /revoke — Revoke access for a profile
app.post('/revoke', (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name === name);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  profile.status = 'revoked';
  profile.lastSeen = new Date().toLocaleString();
  res.json({ message: `Access revoked for ${name}`, profile });
});

// POST /restore — Restore access for a profile
app.post('/restore', (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name === name);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  profile.status = 'active';
  profile.lastSeen = new Date().toLocaleString();
  res.json({ message: `Access restored for ${name}`, profile });
});

// POST /rotate-key — Simulate API key rotation
app.post('/rotate-key', (req, res) => {
  const newKey = Math.random().toString(36).substring(2, 18).toUpperCase();
  res.json({ message: 'API key rotated', newKey });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ COLOSSALTV backend running on port ${PORT}`);
});
