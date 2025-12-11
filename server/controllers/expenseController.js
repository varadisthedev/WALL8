// controllers/expenseController.js
const Expense = require('../models/Expense');

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
    try {
        const { amount, category, date, note } = req.body;

        if (!amount || !category) {
            return res.status(400).json({
                success: false,
                message: 'Amount and category are required'
            });
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

// @desc    Get all expenses (with pagination)
// @route   GET /api/expenses
// @access  Private
exports.getAllExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const expenses = await Expense.find({ userId: req.userId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Expense.countDocuments({ userId: req.userId });

        res.status(200).json({
            success: true,
            data: expenses,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalExpenses: total,
                hasMore: skip + expenses.length < total
            }
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
