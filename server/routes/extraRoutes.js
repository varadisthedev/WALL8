// routes/extraRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, extractUserId, requireProfile } = require('../middleware/auth');
const Expense = require('../models/Expense');
const Analytics = require('../models/Analytics');

// GET /api/categories - Get all available categories (public)
router.get('/categories', (req, res) => {
  res.status(200).json({
    success: true,
    data: ['Food', 'Travel', 'Shopping', 'Entertainment', 'Others']
  });
});

// Apply auth to all routes below
router.use(requireAuth);
router.use(extractUserId);
router.use(requireProfile);

// GET /api/stats - Get basic statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Expense.getTotalExpenses(req.userId);
    const byCategory = await Expense.getExpensesByCategory(req.userId);
    const highest = await Expense.getHighestSpendingCategory(req.userId);
    const avgDaily = await Expense.getAverageDailySpending(req.userId, 30);

    res.status(200).json({
      success: true,
      data: {
        total,
        byCategory,
        highestCategory: highest,
        averageDailySpending: avgDaily
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// GET /api/dashboard - Get complete dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const dashboardStats = await Analytics.getDashboardStats(req.userId);
    const insights = await Analytics.getSpendingInsights(req.userId);
    const prediction = await Analytics.predictMonthlySpending(req.userId);

    res.status(200).json({
      success: true,
      data: {
        stats: dashboardStats,
        insights,
        prediction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// GET /api/chart/category - Get category chart data
router.get('/chart/category', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate || new Date();

    const chartData = await Analytics.getCategoryChartData(req.userId, start, end);

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chart data',
      error: error.message
    });
  }
});

// GET /api/chart/weekly - Get weekly trend data
router.get('/chart/weekly', async (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks) || 4;
    const weeklyData = await Analytics.getWeeklyTrend(req.userId, weeks);

    res.status(200).json({
      success: true,
      data: weeklyData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly trend',
      error: error.message
    });
  }
});

// GET /api/chart/daily - Get daily trend for a month
router.get('/chart/daily', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth();

    const dailyData = await Analytics.getDailyTrend(req.userId, year, month);

    res.status(200).json({
      success: true,
      data: dailyData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily trend',
      error: error.message
    });
  }
});

// GET /api/expenses/search - Search expenses
router.get('/expenses/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const results = await Expense.searchExpenses(req.userId, q);

    res.status(200).json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching expenses',
      error: error.message
    });
  }
});

// GET /api/expenses/filter - Filter expenses by category or date range
router.get('/expenses/filter', async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    let query = { userId: req.userId };

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filtering expenses',
      error: error.message
    });
  }
});

// GET /api/insights - Get spending insights
router.get('/insights', async (req, res) => {
  try {
    const insights = await Analytics.getSpendingInsights(req.userId);
    const topDays = await Analytics.getTopSpendingDays(req.userId, 5);

    res.status(200).json({
      success: true,
      data: {
        insights,
        topSpendingDays: topDays
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching insights',
      error: error.message
    });
  }
});

// GET /api/monthly-report - Get current month report
router.get('/monthly-report', async (req, res) => {
  try {
    const currentMonth = await Expense.getCurrentMonthExpenses(req.userId);
    const byCategory = await Expense.getExpensesByCategory(req.userId);
    const prediction = await Analytics.predictMonthlySpending(req.userId);

    res.status(200).json({
      success: true,
      data: {
        monthSummary: currentMonth[0] || { total: 0, count: 0, avgExpense: 0 },
        categoryBreakdown: byCategory,
        prediction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly report',
      error: error.message
    });
  }
});

module.exports = router;