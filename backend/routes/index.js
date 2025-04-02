// routes/index.js
const express = require('express');
const router = express.Router();

// API Routes
router.use('/api/auth', require('./api/auth'));
router.use('/api/transactions', require('./api/transactions'));
router.use('/api/budgets', require('./api/budgets'));

module.exports = router;