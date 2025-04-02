// routes/api/transactions.js
const express = require('express');
const { check } = require('express-validator');
const {
    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary
} = require('../../controllers/transactionController');
const { protect } = require('../../middleware/auth');
const { validateRequest } = require('../../middleware/validate');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get transaction summary
router.get('/summary', getTransactionSummary);

// Get all transactions and create a transaction
router.route('/')
    .get(getTransactions)
    .post(
        [
            check('amount', 'Amount is required').isNumeric(),
            check('type', 'Type must be income or expense').isIn(['income', 'expense']),
            check('category', 'Category is required').not().isEmpty(),
            check('isRecurring', 'isRecurring must be a boolean').optional().isBoolean(),
            check('recurringFrequency', 'Invalid recurring frequency')
                .optional()
                .isIn(['daily', 'weekly', 'monthly', 'yearly'])
        ],
        validateRequest,
        createTransaction
    );

// Get, update and delete a specific transaction
router.route('/:id')
    .get(getTransaction)
    .put(
        [
            check('amount', 'Amount must be a number').optional().isNumeric(),
            check('type', 'Type must be income or expense').optional().isIn(['income', 'expense']),
            check('isRecurring', 'isRecurring must be a boolean').optional().isBoolean(),
            check('recurringFrequency', 'Invalid recurring frequency')
                .optional()
                .isIn(['daily', 'weekly', 'monthly', 'yearly'])
        ],
        validateRequest,
        updateTransaction
    )
    .delete(deleteTransaction);

module.exports = router;
