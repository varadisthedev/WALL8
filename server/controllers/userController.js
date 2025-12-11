// controllers/userController.js
const User = require('../models/User');

// @desc    Get or create user from Clerk
// @route   POST /api/user/sync
// @access  Private
exports.syncUser = async (req, res) => {
    try {
        const { clerkUser } = req.body;

        if (!clerkUser || !clerkUser.id) {
            return res.status(400).json({
                success: false,
                message: 'Clerk user data is required'
            });
        }

        const user = await User.findOrCreateFromClerk(clerkUser);

        res.status(200).json({
            success: true,
            data: user,
            message: user.profileCompleted ? 'User synced' : 'Please complete your profile'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error syncing user',
            error: error.message
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// @desc    Complete user profile (onboarding)
// @route   POST /api/user/onboarding
// @access  Private
exports.completeOnboarding = async (req, res) => {
    try {
        const { age, monthlyAllowance, institution, course, year, city } = req.body;

        // Validation
        if (!age || !monthlyAllowance) {
            return res.status(400).json({
                success: false,
                message: 'Age and monthly allowance are required'
            });
        }

        const user = await User.findOne({ clerkId: req.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update profile
        await user.updateProfileAndBudget({
            age,
            monthlyAllowance,
            institution,
            course,
            year,
            city
        });

        // Get AI-suggested budget
        const aiSuggestion = user.calculateAISuggestedBudget();

        // Apply AI-suggested budget
        user.setCustomBudget(aiSuggestion.percentages);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile completed successfully',
            data: {
                user,
                suggestedBudget: aiSuggestion
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error completing onboarding',
            error: error.message
        });
    }
};

// @desc    Get AI-suggested budget
// @route   GET /api/user/ai-budget-suggestion
// @access  Private
exports.getAIBudgetSuggestion = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.userId });

        if (!user || !user.profile.monthlyAllowance) {
            return res.status(400).json({
                success: false,
                message: 'Monthly allowance not set'
            });
        }

        const suggestion = user.calculateAISuggestedBudget();

        res.status(200).json({
            success: true,
            data: suggestion,
            message: 'AI-powered budget suggestion based on student spending patterns'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating budget suggestion',
            error: error.message
        });
    }
};

// @desc    Update custom budget
// @route   PUT /api/user/budget
// @access  Private
exports.updateBudget = async (req, res) => {
    try {
        const { percentages } = req.body;

        if (!percentages) {
            return res.status(400).json({
                success: false,
                message: 'Budget percentages are required'
            });
        }

        const user = await User.findOne({ clerkId: req.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.setCustomBudget(percentages);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Budget updated successfully',
            data: {
                budget: user.budget,
                percentages: user.budgetPercentages
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating budget'
        });
    }
};

// @desc    Get budget status
// @route   GET /api/user/budget-status
// @access  Private
exports.getBudgetStatus = async (req, res) => {
    try {
        const Expense = require('../models/Expense');
        const user = await User.findOne({ clerkId: req.userId });

        if (!user || !user.hasBudget) {
            return res.status(400).json({
                success: false,
                message: 'No budget set'
            });
        }

        // Get current month spending by category
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const spending = await Expense.aggregate([
            {
                $match: {
                    userId: req.userId,
                    date: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: '$category',
                    spent: { $sum: '$amount' }
                }
            }
        ]);

        // Create budget status for each category
        const budgetStatus = {};
        const categories = ['food', 'travel', 'shopping', 'entertainment', 'others'];

        categories.forEach(category => {
            const categorySpending = spending.find(s => s._id.toLowerCase() === category);
            const spent = categorySpending ? categorySpending.spent : 0;
            const budget = user.budget[category];
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;

            budgetStatus[category] = {
                budget,
                spent,
                remaining: Math.max(0, budget - spent),
                percentage: percentage.toFixed(2),
                status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
            };
        });

        // Calculate totals
        const totalBudget = user.totalBudget;
        const totalSpent = spending.reduce((sum, s) => sum + s.spent, 0);

        res.status(200).json({
            success: true,
            data: {
                totalBudget,
                totalSpent,
                totalRemaining: Math.max(0, totalBudget - totalSpent),
                overallPercentage: totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(2) : 0,
                categories: budgetStatus,
                monthlyAllowance: user.profile.monthlyAllowance
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching budget status',
            error: error.message
        });
    }
};

// @desc    Update profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findOne({ clerkId: req.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update profile fields
        if (updates.profile) {
            await user.updateProfileAndBudget(updates.profile);
        }

        // Update preferences
        if (updates.preferences) {
            user.preferences = { ...user.preferences, ...updates.preferences };
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};