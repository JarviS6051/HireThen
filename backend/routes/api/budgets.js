// routes/api/budgets.js
const express = require('express');
const { check } = require('express-validator');
const {
    getBudgets,
    getBudget,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetStatus
} = require('../../controllers/budgetController');
const { protect } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validate');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get budget status and alerts
router.get('/status', getBudgetStatus);

// Get all budgets and create a budget
router.route('/')
    .get(getBudgets)
    .post(
        [
            check('category', 'Category is required').not().isEmpty(),
            check('amount', 'Amount is required').isNumeric(),
            check('period', 'Period must be daily, weekly, monthly, or yearly')
                .optional()
                .isIn(['daily', 'weekly', 'monthly', 'yearly']),
            check('alertThreshold', 'Alert threshold must be between 0 and 1')
                .optional()
                .isFloat({ min: 0, max: 1 })
        ],
        validateRequest,
        createBudget
    );

// Get, update and delete a specific budget
router.route('/:id')
    .get(getBudget)
    .put(
        [
            check('category', 'Category must be a string').optional().isString(),
            check('amount', 'Amount must be a number').optional().isNumeric(),
            check('period', 'Period must be daily, weekly, monthly, or yearly')
                .optional()
                .isIn(['daily', 'weekly', 'monthly', 'yearly']),
            check('alertThreshold', 'Alert threshold must be between 0 and 1')
                .optional()
                .isFloat({ min: 0, max: 1 })
        ],
        validateRequest,
        updateBudget
    )
    .delete(deleteBudget);

module.exports = router;