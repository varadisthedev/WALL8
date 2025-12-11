// models/Analytics.js
const Expense = require('./Expense');

class Analytics {
  // Get comprehensive dashboard statistics
  static async getDashboardStats(userId) {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
      const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
      const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const [
        currentMonthData,
        lastMonthData,
        currentWeekData,
        categoryBreakdown,
        recentExpenses,
        totalStats
      ] = await Promise.all([
        Expense.aggregate([
          { $match: { userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 }, average: { $avg: '$amount' } } }
        ]),
        Expense.aggregate([
          { $match: { userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Expense.aggregate([
          { $match: { userId, date: { $gte: startOfWeek } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]),
        Expense.aggregate([
          { $match: { userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
          { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          { $sort: { total: -1 } }
        ]),
        Expense.find({ userId }).sort({ date: -1 }).limit(5),
        Expense.aggregate([
          { $match: { userId } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ])
      ]);

      const currentMonthTotal = currentMonthData[0]?.total || 0;
      const categoryWithPercentage = categoryBreakdown.map(cat => ({
        ...cat,
        percentage: currentMonthTotal > 0 ? ((cat.total / currentMonthTotal) * 100).toFixed(2) : 0
      }));

      return {
        currentMonth: {
          total: currentMonthData[0]?.total || 0,
          count: currentMonthData[0]?.count || 0,
          average: currentMonthData[0]?.average || 0
        },
        lastMonth: { total: lastMonthData[0]?.total || 0 },
        currentWeek: {
          total: currentWeekData[0]?.total || 0,
          count: currentWeekData[0]?.count || 0
        },
        comparison: {
          monthlyChange: this.calculatePercentageChange(
            lastMonthData[0]?.total || 0,
            currentMonthData[0]?.total || 0
          )
        },
        categoryBreakdown: categoryWithPercentage,
        recentExpenses,
        allTime: {
          total: totalStats[0]?.total || 0,
          count: totalStats[0]?.count || 0
        }
      };
    } catch (error) {
      throw new Error(`Analytics error: ${error.message}`);
    }
  }

  static calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return (((newValue - oldValue) / oldValue) * 100).toFixed(2);
  }

  static async getDailyTrend(userId, year, month) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const dailyData = await Expense.aggregate([
      { $match: { userId, date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dayOfMonth: '$date' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return dailyData;
  }

  static async getCategoryChartData(userId, startDate, endDate) {
    const data = await Expense.aggregate([
      { $match: { userId, date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: '$category', value: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, count: 1, _id: 0 } }
    ]);

    return data;
  }

  static async getWeeklyTrend(userId, weeks = 4) {
    const now = new Date();
    const weekData = [];

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekTotal = await Expense.aggregate([
        { $match: { userId, date: { $gte: weekStart, $lte: weekEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      weekData.push({
        week: `Week ${weeks - i}`,
        startDate: weekStart,
        endDate: weekEnd,
        total: weekTotal[0]?.total || 0
      });
    }

    return weekData;
  }

  static async getTopSpendingDays(userId, limit = 5) {
    return await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          date: { $first: '$date' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: limit }
    ]);
  }

  static async predictMonthlySpending(userId) {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const monthToDateExpenses = await Expense.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
            $lte: now
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSoFar = monthToDateExpenses[0]?.total || 0;
    const dailyAverage = totalSoFar / dayOfMonth;
    const predictedTotal = dailyAverage * daysInMonth;

    return {
      currentTotal: totalSoFar,
      predictedTotal: predictedTotal.toFixed(2),
      dailyAverage: dailyAverage.toFixed(2),
      daysRemaining: daysInMonth - dayOfMonth
    };
  }

  static async getSpendingInsights(userId) {
    const stats = await this.getDashboardStats(userId);
    const insights = [];

    if (stats.currentMonth.total > stats.lastMonth.total * 1.2) {
      insights.push({
        type: 'warning',
        message: 'Your spending is 20% higher than last month',
        icon: '⚠️'
      });
    }

    if (stats.categoryBreakdown.length > 0) {
      const topCategory = stats.categoryBreakdown[0];
      insights.push({
        type: 'info',
        message: `${topCategory._id} is your highest spending category at ₹${topCategory.total.toFixed(2)}`,
        icon: '📊'
      });
    }

    const dailyAvg = stats.currentMonth.average || 0;
    insights.push({
      type: 'info',
      message: `Your average expense per transaction is ₹${dailyAvg.toFixed(2)}`,
      icon: '💰'
    });

    return insights;
  }
}

module.exports = Analytics;