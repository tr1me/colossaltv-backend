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

// Add Profile
app.post("/profile", (req, res) => {
  const newProfile = { name: "VIPViewer", status: "active" };
  profiles.push(newProfile);
  res.json({ success: true, profile: newProfile });
});

// Revoke Access
app.post("/revoke", (req, res) => {
  const profile = profiles.find(p => p.name === "VIPViewer");
  if (profile) {
    profile.status = "revoked";
    res.json({ success: true, profile });
  } else {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
});

// Restore Access
app.post("/restore", (req, res) => {
  const profile = profiles.find(p => p.name === "VIPViewer");
  if (profile) {
    profile.status = "active";
    res.json({ success: true, profile });
  } else {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
});

// Rotate API Key
app.post("/rotate-key", (req, res) => {
  const newKey = Math.random().toString(36).substring(2, 12);
  res.json({ success: true, apiKey: newKey });
});

// 🔍 Search Profile (new)
app.get("/profile/:name", (req, res) => {
  const name = req.params.name;
  const profile = profiles.find(p => p.name === name);

  if (profile) {
    res.json({ success: true, profile });
  } else {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
});

app.listen(PORT, () => {
  console.log(`✨ COLOSSALTV backend running on port ${PORT}`);
});
