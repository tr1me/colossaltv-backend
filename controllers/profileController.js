const db = require('../models/profileModel');

exports.getProfiles = async (req, res) => {
  const profiles = await db.getAllProfiles();
  res.json(profiles);
};

exports.revokeProfile = async (req, res) => {
  await db.updateStatus(req.params.id, 'revoked');
  res.json({ message: 'Profile revoked' });
};

exports.restoreProfile = async (req, res) => {
  await db.updateStatus(req.params.id, 'active');
  res.json({ message: 'Profile restored' });
};

exports.rotateApiKey = async (req, res) => {
  const newKey = 'new-key-' + Date.now(); // Replace with real key rotation logic
  await db.rotateApiKey(newKey);
  res.json({ message: 'API key rotated', newKey });
};
