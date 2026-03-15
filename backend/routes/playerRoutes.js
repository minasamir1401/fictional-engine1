const express = require('express');
const router = express.Router();
const { getPlayers, getAllMembers } = require('../controllers/playerController');

// Get all users with role 'player'
router.get('/', getPlayers);

// Get all members (players and coaches)
router.get('/all', getAllMembers);

module.exports = router;
