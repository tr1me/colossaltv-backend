const express = require('express');
const router = express.Router();
const {
  getProfiles,
  revokeProfile,
  restoreProfile,
  rotateApiKey
} = require('../controllers/profileController');

router.get('/', getProfiles);
router.post('/:id/revoke', revokeProfile);
router.post('/:id/restore', restoreProfile);
router.post('/rotate-key', rotateApiKey);

module.exports = router;
