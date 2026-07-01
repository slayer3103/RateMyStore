const express = require('express');
const { register, login, logout, getMe, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema, updatePasswordSchema } = require('../validators/schemas');

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.patch('/password', authenticate, validate(updatePasswordSchema), changePassword);

module.exports = router;
