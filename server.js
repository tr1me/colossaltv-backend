const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✨ COLOSSALTV backend running on port ${PORT}`);
});

// In-memory profiles
let profiles = [];

// Add Profile (accepts name from request body)
app.post("/profile", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  const newKey = Math.random().toString(36).substring(2, 12);
  const newProfile = { name, status: "active", apiKey: newKey };
  profiles.push(newProfile);
  res.json({ success: true, profile: newProfile });
});

// Revoke Access
app.post("/revoke", (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name === name);
  if (profile) {
    profile.status = "revoked";
    res.json({ success: true, profile });
  } else {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
});

// Restore Access
app.post("/restore", (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name === name);
  if (profile) {
    profile.status = "active";
    res.json({ success: true, profile });
  } else {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
});

// Rotate API Key (per profile)
app.post("/rotate-key", (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name === name);
  if (profile) {
    const newKey = Math.random().toString(36).substring(2, 12);
    profile.apiKey = newKey;
    res.json({ success: true, profile });
  } else {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
});

// Delete Profile
app.post("/delete", (req, res) => {
  const { name } = req.body;
  const index = profiles.findIndex(p => p.name === name);
  if (index !== -1) {
    const removed = profiles.splice(index, 1)[0];
    res.json({ success: true, profile: removed });
  } else {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
});

// Search Profile
app.get("/profile/:name", (req, res) => {
  const name = req.params.name;
  const profile = profiles.find(p => p.name === name);
  if (profile) {
    res.json({ success: true, profile });
  } else {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
});

// List All Profiles
app.get("/profiles", (req, res) => {
  res.json({ success: true, profiles });
});
