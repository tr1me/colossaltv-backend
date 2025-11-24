const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

// Store profiles in memory
let profiles = [];

// Store your single Premiumize API key securely (use environment variable in production)
const PREMIUMIZE_KEY = process.env.PREMIUMIZE_KEY || "YOUR_PREMIUMIZE_API_KEY";

// Add a profile
app.post("/profile", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "Name required" });

  const newProfile = { name, status: "active" };
  profiles.push(newProfile);
  res.json({ success: true, profile: newProfile });
});

// Revoke profile
app.post("/revoke", (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (!profile) return res.json({ success: false, message: "Profile not found" });
  profile.status = "revoked";
  res.json({ success: true, profile });
});

// Restore profile
app.post("/restore", (req, res) => {
  const { name } = req.body;
  const profile = profiles.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (!profile) return res.json({ success: false, message: "Profile not found" });
  profile.status = "active";
  res.json({ success: true, profile });
});

// Delete profile
app.post("/delete", (req, res) => {
  const { name } = req.body;
  profiles = profiles.filter(p => p.name.toLowerCase() !== name.toLowerCase());
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
    res.status(500).json({ success: false, message: "Premiumize request failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
