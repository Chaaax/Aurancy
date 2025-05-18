const express = require('express');
const router = express.Router();
const { register, login, getMe, getUserProfile } = require('../controllers/authcontroller');
const authenticateToken = require('../middlewares/auth'); // ← NOME CORRETO

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', authenticateToken, getUserProfile);

module.exports = router;