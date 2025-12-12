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
// @query   type=weekly|category|daily, weeks=4, startDate=..., endDate=...
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
router.get('/ai-insights', requireProfile, async (req, res) => {
    try {
        // Get user data
        const user = await User.findOne({ clerkId: req.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get expense summary
        const summary = await Analytics.getDashboardStats(req.userId);

        // Get budget status
        const budgetData = await user.getBudgetAnalysis();

        // Generate AI insights
        const insights = await geminiService.generateSpendingInsights(
            {
                age: user.profile.age,
                monthlyAllowance: user.profile.monthlyAllowance,
                institution: user.profile.institution,
                city: user.profile.city
            },
            summary,
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
