// models/Budget.js
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add a budget amount']
    },
    period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null
    },
    alertThreshold: {
        type: Number,
        default: 0.8, // Alert when 80% of budget is used
        min: 0,
        max: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for faster queries
BudgetSchema.index({ user: 1, category: 1 });
BudgetSchema.index({ user: 1, period: 1 });

module.exports = mongoose.model('Budget', BudgetSchema);