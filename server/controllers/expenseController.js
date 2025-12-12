// controllers/expenseController.js
const Expense = require('../models/Expense');
const geminiService = require('../services/geminiService');

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
    try {
        let { amount, category, date, note } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: 'Amount is required'
            });
        }

        // Auto-categorize using AI if category is empty and note is provided
        if (!category && note) {
            console.log(`🤖 Auto-categorizing expense: "${note}"`);
            category = await geminiService.categorizeExpense(note, amount);
        } else if (!category) {
            // Default to Others if no category and no note
            category = 'Others';
        }

        const expense = await Expense.create({
            userId: req.userId,
            amount,
            category,
            date: date || new Date(),
            note: note || ''
        });

        res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding expense',
            error: error.message
        });
    }
};

// @desc    Get all expenses (with pagination, filter, search)
// @route   GET /api/expenses
// @access  Private
exports.getAllExpenses = async (req, res) => {
    try {
        const result = await Expense.getExpenses(req.userId, req.query);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching expenses',
            error: error.message
        });
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching expense',
            error: error.message
        });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    try {
        const { amount, category, date, note } = req.body;

        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { amount, category, date, note },
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Expense updated successfully',
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating expense',
            error: error.message
        });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting expense',
            error: error.message
        });
    }
};
