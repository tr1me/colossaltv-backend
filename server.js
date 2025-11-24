const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// Path to persistent storage file inside Fly.io volume
const DATA_FILE = path.join("/data", "profiles.json");

// Load profiles from disk if file exists
let profiles = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    profiles = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    console.error("Failed to load profiles:", err);
    profiles = [];
  }
}

// Helper: save profiles to disk
function saveProfiles() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2));
  } catch (err) {
    console.error("Failed to save profiles:", err);
  }
}

// Premiumize API key (must be set as Fly secret)
const PREMIUMIZE_KEY = process.env.PREMIUMIZE_KEY;
if (!PREMIUMIZE_KEY) {
  console.warn("⚠️ PREMIUMIZE_KEY not set. Run: fly secrets set PREMIUMIZE_KEY=your_api_key");
}

// Root route for Fly.io smoke checks
app.get("/", (req, res) => {
  res.json({ success: true, message: "COLOSSALTV backend is running" });
});

// Add a profile
app.post("/profile", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "Name required" });

  const newProfile = { name, status: "active" };
  profiles.push(newProfile);
  saveProfiles();
  res.json({ success: true, profile: newProfile });
});

// Revoke profile
app.post("/revoke", (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (!profile) return res.json({ success: false, message: "Profile not found" });
  profile.status = "revoked";
  saveProfiles();
  res.json({ success: true, profile });
});

// Restore profile
app.post("/restore", (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (!profile) return res.json({ success: false, message: "Profile not found" });
  profile.status = "active";
  saveProfiles();
  res.json({ success: true, profile });
});

// Delete profile
app.post("/delete", (req, res) => {
  const { name } = req.body;
  profiles = profiles.filter(p => p.name.toLowerCase() !== name.toLowerCase());
  saveProfiles();
  res.json({ success: true });
});

// List profiles
app.get("/profiles", (req, res) => {
  res.json({ success: true, profiles });
});

// Search profile
app.get("/profile/:name", (req, res) => {
  const profile = profiles.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
  if (!profile) return res.json({ success: false, message: "Profile not found" });
  res.json({ success: true, profile });
});

// Premiumize account info (only if profile is active)
app.get("/premiumize/:name/account", async (req, res) => {
  const profile = profiles.find(p => p.name.toLowerCase() === req.params.name.toLowerCase());
  if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
  if (profile.status !== "active") return res.status(403).json({ success: false, message: "Access revoked" });

  try {
    const response = await fetch(`https://www.premiumize.me/api/account/info?apikey=${PREMIUMIZE_KEY}`);
    const data = await response.json();
    res.json({ success: true, premiumize: data });
  } catch (err) {
    console.error("Premiumize request failed:", err);
    res.status(500).json({ success: false, message: "Premiumize request failed" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
