const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const authenticateToken = require('../middlewares/auth');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me → deve chamar getMe (com imagem incluída)
router.get('/me', authenticateToken, authController.getMe);

// POST /api/auth/upload-profile-picture
router.post('/upload-profile-picture', authenticateToken, authController.uploadProfilePicture);

module.exports = router;