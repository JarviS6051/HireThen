// controllers/transactionController.js
const Transaction = require('../models/Transaction');

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        // Build query
        const query = { user: req.user.id };

        // Filter by type if provided
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Filter by category if provided
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Date range filter
        if (req.query.startDate && req.query.endDate) {
            query.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        } else if (req.query.startDate) {
            query.date = { $gte: new Date(req.query.startDate) };
        } else if (req.query.endDate) {
            query.date = { $lte: new Date(req.query.endDate) };
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Execute query
        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            success: true,
            count: transactions.length,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: transactions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get a single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this transaction'
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (err) {
        console.error(err);

        // Handle invalid ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
    try {
        // Add user to request body
        req.body.user = req.user.id;

        // Handle recurring transactions
        if (req.body.isRecurring && req.body.recurringFrequency) {
            // Set next occurrence based on frequency
            const date = new Date(req.body.date || Date.now());
            const nextOccurrence = new Date(date);

            switch (req.body.recurringFrequency) {
                case 'daily':
                    nextOccurrence.setDate(date.getDate() + 1);
                    break;
                case 'weekly':
                    nextOccurrence.setDate(date.getDate() + 7);
                    break;
                case 'monthly':
                    nextOccurrence.setMonth(date.getMonth() + 1);
                    break;
                case 'yearly':
                    nextOccurrence.setFullYear(date.getFullYear() + 1);
                    break;
            }

            req.body.nextOccurrence = nextOccurrence;
        }

        const transaction = await Transaction.create(req.body);

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this transaction'
            });
        }

        // Handle recurring updates if needed
        if (typeof req.body.isRecurring !== 'undefined' || req.body.recurringFrequency) {
            if (req.body.isRecurring && req.body.recurringFrequency) {
                // Set next occurrence based on frequency
                const date = new Date(req.body.date || transaction.date);
                const nextOccurrence = new Date(date);

                switch (req.body.recurringFrequency) {
                    case 'daily':
                        nextOccurrence.setDate(date.getDate() + 1);
                        break;
                    case 'weekly':
                        nextOccurrence.setDate(date.getDate() + 7);
                        break;
                    case 'monthly':
                        nextOccurrence.setMonth(date.getMonth() + 1);
                        break;
                    case 'yearly':
                        nextOccurrence.setFullYear(date.getFullYear() + 1);
                        break;
                }

                req.body.nextOccurrence = nextOccurrence;
            } else if (req.body.isRecurring === false) {
                req.body.recurringFrequency = null;
                req.body.nextOccurrence = null;
            }
        }

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (err) {
        console.error(err);

        // Handle invalid ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this transaction'
            });
        }

        await transaction.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err);

        // Handle invalid ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get transaction summary
// @route   GET /api/transactions/summary
// @access  Private
exports.getTransactionSummary = async (req, res) => {
    try {
        const period = req.query.period || 'month';
        const date = new Date();
        let startDate, endDate;

        // Set date range based on period
        switch (period) {
            case 'week':
                startDate = new Date(date.setDate(date.getDate() - date.getDay()));
                endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 6));
                break;
            case 'month':
                startDate = new Date(date.getFullYear(), date.getMonth(), 1);
                endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                break;
            case 'year':
                startDate = new Date(date.getFullYear(), 0, 1);
                endDate = new Date(date.getFullYear(), 11, 31);
                break;
            default:
                startDate = new Date(date.getFullYear(), date.getMonth(), 1);
                endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        }

        // Get total income for period
        const income = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: 'income',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Get total expenses for period
        const expenses = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: 'expense',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Get expenses by category
        const expensesByCategory = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: 'expense',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                income: income.length > 0 ? income[0].total : 0,
                expenses: expenses.length > 0 ? expenses[0].total : 0,
                balance: (income.length > 0 ? income[0].total : 0) - (expenses.length > 0 ? expenses[0].total : 0),
                expensesByCategory,
                period,
                dateRange: {
                    startDate,
                    endDate
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};