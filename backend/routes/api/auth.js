// routes/api/auth.js
const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe } = require('../../controllers/authController');
const { protect } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validate');

const router = express.Router();

// Register user
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    validateRequest,
    register
);

// Login user
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    validateRequest,
    login
);

// Get current user
router.get('/me', protect, getMe);

module.exports = router;