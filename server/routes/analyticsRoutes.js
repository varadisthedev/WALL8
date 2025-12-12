// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, extractUserId, requireProfile } = require('../middleware/auth');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const geminiService = require('../services/geminiService');

// Apply auth to all analytics routes
router.use(requireAuth);
router.use(extractUserId);

// @route   GET /api/analytics/summary
// @desc    Get dashboard summary statistics
router.get('/summary', async (req, res) => {
    try {
        const stats = await Analytics.getDashboardStats(req.userId);
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics summary',
            error: error.message
        });
    }
});

// @route   GET /api/analytics/chart
// @desc    Get chart data (weekly trend or category breakdown)
// @query   type=weekly|category|daily|today, weeks=4, startDate=..., endDate=...
router.get('/chart', async (req, res) => {
    try {
        const { type, weeks, startDate, endDate, year, month } = req.query;
        let data;

        if (type === 'category') {
            const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const end = endDate ? new Date(endDate) : new Date();
            data = await Analytics.getCategoryChartData(req.userId, start, end);
        } else if (type === 'daily') {
            const y = parseInt(year) || new Date().getFullYear();
            const m = parseInt(month) || new Date().getMonth();
            data = await Analytics.getDailyTrend(req.userId, y, m);
        } else if (type === 'today') {
            data = await Analytics.getTodayHourlyTrend(req.userId);
        } else if (type === 'heatmap') {
            data = await Analytics.getHeatmapData(req.userId);
        } else {
            // Default to weekly
            const numWeeks = parseInt(weeks) || 4;
            data = await Analytics.getWeeklyTrend(req.userId, numWeeks);
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching chart data',
            error: error.message
        });
    }
});

// @route   GET /api/analytics/ai-insights
// @desc    Get AI-generated spending insights and tips
router.get('/ai-insights', async (req, res) => {
    try {
        // Get user data (don't require profile completion)
        const user = await User.findOne({ clerkId: req.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get expense summary
        const summary = await Analytics.getDashboardStats(req.userId);

        // Calculate budget data manually
        const Expense = require('../models/Expense');
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentMonthExpenses = await Expense.aggregate([
            {
                $match: {
                    userId: req.userId,
                    date: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const monthlyTotal = currentMonthExpenses[0]?.total || 0;
        const monthlyCount = currentMonthExpenses[0]?.count || 0;
        const monthlyAllowance = user.profile?.monthlyAllowance || 0;

        const budgetData = {
            currentMonth: {
                total: monthlyTotal,
                count: monthlyCount,
                average: monthlyCount > 0 ? monthlyTotal / monthlyCount : 0
            },
            monthlyAllowance: monthlyAllowance,
            remaining: Math.max(0, monthlyAllowance - monthlyTotal),
            isOverBudget: monthlyAllowance > 0 && monthlyTotal > monthlyAllowance,
            percentageUsed: monthlyAllowance > 0 ? (monthlyTotal / monthlyAllowance) * 100 : 0
        };

        // Get top categories for better insights (fix the mapping)
        const topCategories = summary?.categoryBreakdown?.slice(0, 3).map(cat => ({
            category: cat._id,
            total: cat.total,
            count: cat.count
        })) || [];

        // Check if user has any expenses
        if (monthlyTotal === 0 && (!summary?.allTime?.total || summary.allTime.total === 0)) {
            return res.status(200).json({
                success: true,
                data: {
                    insights: [
                        "You haven't added any expenses yet!",
                        "Start tracking your expenses to get personalized AI insights.",
                        "The more data you add, the better insights you'll receive."
                    ],
                    tips: [
                        "Add your first expense to begin tracking",
                        "Set up your monthly allowance in your profile",
                        "Try to log expenses as soon as they happen"
                    ]
                }
            });
        }

        // Generate AI insights
        const insights = await geminiService.generateSpendingInsights(
            {
                age: user.profile?.age || 'Not specified',
                monthlyAllowance: user.profile?.monthlyAllowance || 0,
                institution: user.profile?.institution || 'Not specified',
                city: user.profile?.city || 'Not specified'
            },
            {
                ...summary,
                topCategories
            },
            budgetData
        );

        res.status(200).json({
            success: true,
            data: insights
        });
    } catch (error) {
        console.error('AI Insights Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating AI insights',
            error: error.message
        });
    }
});

module.exports = router;
