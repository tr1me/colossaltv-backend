// server.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Root route — JSON heartbeat
app.get('/', (req, res) => {
  res.json({ success: true, message: "COLOSSALTV backend is running" });
});

// Profiles (in-memory for now)
let profiles = [];

// Create profile
app.post('/profiles', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }
  const profile = { name, status: "active" };
  profiles.push(profile);
  res.json({ success: true, profile });
});

// List profiles
app.get('/profiles', (req, res) => {
  res.json({ success: true, profiles });
});

// ✅ Search profile (added route)
app.get('/profiles/:name', (req, res) => {
  const profile = profiles.find(
    p => p.name.toLowerCase() === req.params.name.toLowerCase()
  );
  if (!profile) {
    return res.json({ success: false, message: "Profile not found" });
  }
  res.json({ success: true, profile });
});

// Delete profile
app.delete('/profiles/:name', (req, res) => {
  const { name } = req.params;
  profiles = profiles.filter(p => p.name.toLowerCase() !== name.toLowerCase());
  res.json({ success: true, message: `Profile ${name} deleted` });
});

// Revoke profile
app.post('/profiles/:name/revoke', (req, res) => {
  const profile = profiles.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
  if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
  profile.status = "revoked";
  res.json({ success: true, profile });
});

// Restore profile
app.post('/profiles/:name/restore', (req, res) => {
  const profile = profiles.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
  if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
  profile.status = "active";
  res.json({ success: true, profile });
});

// Premiumize account (stubbed)
app.get('/premiumize/:name/account', (req, res) => {
  res.json({ success: true, account: { name: req.params.name, plan: "premium" } });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ COLOSSALTV backend running on port ${PORT}`);
});
