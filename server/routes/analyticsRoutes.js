// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, extractUserId } = require('../middleware/auth');
const Analytics = require('../models/Analytics');

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

module.exports = router;
