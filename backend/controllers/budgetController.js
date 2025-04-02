// backend/controllers/budgetController.js
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: budgets.length,
            data: budgets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get a single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                error: 'Budget not found'
            });
        }

        // Make sure user owns budget
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this budget'
            });
        }

        res.status(200).json({
            success: true,
            data: budget
        });
    } catch (err) {
        console.error(err);

        // Handle invalid ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Budget not found'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res) => {
    try {
        // Add user to request body
        req.body.user = req.user.id;

        // Create budget
        const budget = await Budget.create(req.body);

        res.status(201).json({
            success: true,
            data: budget
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                error: 'Budget not found'
            });
        }

        // Make sure user owns budget
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this budget'
            });
        }

        budget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: budget
        });
    } catch (err) {
        console.error(err);

        // Handle invalid ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Budget not found'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
// backend/controllers/budgetController.js
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                error: 'Budget not found'
            });
        }

        // Make sure user owns budget
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this budget'
            });
        }

        // Use deleteOne instead of remove
        await Budget.deleteOne({ _id: budget._id });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {


        // Handle invalid ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Budget not found'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get budget status and alerts
// @route   GET /api/budgets/status
// @access  Private
exports.getBudgetStatus = async (req, res) => {
    try {
        // Get all budgets for the user
        const budgets = await Budget.find({ user: req.user.id });

        // Array to store budget status with spending
        const budgetStatus = [];

        // Current date
        const now = new Date();

        // Process each budget
        for (const budget of budgets) {
            // Determine date range based on period
            let startDate, endDate;

            switch (budget.period) {
                case 'daily':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                    break;
                case 'weekly':
                    // Start of current week (Sunday)
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - now.getDay());
                    startDate.setHours(0, 0, 0, 0);

                    // End of current week (Saturday)
                    endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case 'monthly':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                    break;
                case 'yearly':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                    break;
            }

            // Get expenses in this category for the period
            const expenses = await Transaction.aggregate([
                {
                    $match: {
                        user: req.user._id,
                        type: 'expense',
                        category: budget.category,
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

            const spent = expenses.length > 0 ? expenses[0].total : 0;
            const remaining = budget.amount - spent;
            const percentUsed = (spent / budget.amount) * 100;

            // Check if alert should be triggered
            const isAlertTriggered = percentUsed >= (budget.alertThreshold * 100);

            budgetStatus.push({
                budget: {
                    id: budget._id,
                    category: budget.category,
                    amount: budget.amount,
                    period: budget.period,
                    alertThreshold: budget.alertThreshold
                },
                spent,
                remaining,
                percentUsed,
                isAlertTriggered,
                dateRange: {
                    startDate,
                    endDate
                }
            });
        }

        // Sort by alert status and then by percent used
        budgetStatus.sort((a, b) => {
            if (a.isAlertTriggered !== b.isAlertTriggered) {
                return a.isAlertTriggered ? -1 : 1;
            }
            return b.percentUsed - a.percentUsed;
        });

        res.status(200).json({
            success: true,
            count: budgetStatus.length,
            data: budgetStatus
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};