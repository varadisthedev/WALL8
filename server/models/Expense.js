// models/Expense.js
const mongoose = require('mongoose');

// Expense Schema Definition
const expenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: 'Amount must be a positive number'
    }
  },
  category: {
    type: String,
    enum: {
      values: ['Food', 'Travel', 'Shopping', 'Entertainment', 'Others'],
      message: '{VALUE} is not a valid category'
    },
    trim: true,
    default: 'Others'
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    validate: {
      validator: function (value) {
        // Ensure date is not in the future
        return value <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  },
  note: {
    type: String,
    maxlength: [200, 'Note cannot exceed 200 characters'],
    trim: true,
    default: ''
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
expenseSchema.index({ date: -1 }); // For sorting by date (descending)
expenseSchema.index({ category: 1 }); // For filtering by category
expenseSchema.index({ createdAt: -1 }); // For recent expenses
expenseSchema.index({ userId: 1, date: -1 }); // For user-specific queries

// Virtual field - format amount to 2 decimal places
expenseSchema.virtual('formattedAmount').get(function () {
  return `₹${this.amount.toFixed(2)}`;
});

// Virtual field - get month and year
expenseSchema.virtual('monthYear').get(function () {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(this.date);
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
});

// Instance method - Check if expense is from current month
expenseSchema.methods.isCurrentMonth = function () {
  const now = new Date();
  const expenseDate = new Date(this.date);
  return now.getMonth() === expenseDate.getMonth() &&
    now.getFullYear() === expenseDate.getFullYear();
};

// Instance method - Check if expense is from current week
expenseSchema.methods.isCurrentWeek = function () {
  const now = new Date();
  const expenseDate = new Date(this.date);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return expenseDate >= oneWeekAgo && expenseDate <= now;
};

// Static method - Get total expenses
expenseSchema.statics.getTotalExpenses = async function (userId) {
  const result = await this.aggregate([
    {
      $match: { userId: userId }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
  return result.length > 0 ? result[0] : { total: 0, count: 0 };
};

// Static method - Get expenses by category
expenseSchema.statics.getExpensesByCategory = async function (userId) {
  return await this.aggregate([
    {
      $match: { userId: userId }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
};

// Static method - Get monthly expenses
expenseSchema.statics.getMonthlyExpenses = async function (userId, year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  return await this.aggregate([
    {
      $match: {
        userId: userId,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgExpense: { $avg: '$amount' }
      }
    }
  ]);
};

// Static method - Get expenses for current month
expenseSchema.statics.getCurrentMonthExpenses = async function (userId) {
  const now = new Date();
  return await this.getMonthlyExpenses(userId, now.getFullYear(), now.getMonth());
};

// Static method - Get highest spending category
expenseSchema.statics.getHighestSpendingCategory = async function (userId) {
  const result = await this.aggregate([
    {
      $match: { userId: userId }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' }
      }
    },
    {
      $sort: { total: -1 }
    },
    {
      $limit: 1
    }
  ]);
  return result.length > 0 ? result[0] : null;
};

// Static method - Get average daily spending
expenseSchema.statics.getAverageDailySpending = async function (userId, days = 30) {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const result = await this.aggregate([
    {
      $match: {
        userId: userId,
        date: { $gte: dateLimit }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const total = result.length > 0 ? result[0].total : 0;
  return (total / days).toFixed(2);
};

// Static method - Get expenses by date range
expenseSchema.statics.getExpensesByDateRange = async function (userId, startDate, endDate) {
  return await this.find({
    userId: userId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).sort({ date: -1 });
};

// Static method - Search expenses
// Static method - Advanced Find (Filter, Search, Pagination)
expenseSchema.statics.getExpenses = async function (userId, queryParams) {
  const {
    search,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortValue = -1
  } = queryParams;

  const query = { userId };

  // Search by keyword
  if (search) {
    query.$or = [
      { note: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by category
  if (category && category !== 'All') {
    query.category = category;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const expenses = await this.find(query)
    .sort({ date: sortValue })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments(query);

  return {
    data: expenses,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalExpenses: total,
      hasMore: skip + expenses.length < total
    }
  };
};

// Pre-save middleware - Log when expense is created
expenseSchema.pre('save', function () {
  console.log(`💰 New expense of ₹${this.amount} in ${this.category} category`);
});

// Post-save middleware - Can be used for notifications
expenseSchema.post('save', function (doc) {
  console.log(`✅ Expense saved successfully with ID: ${doc._id}`);
});

// Pre-remove middleware
expenseSchema.pre('remove', function () {
  console.log(`🗑️ Deleting expense: ${this._id}`);
});

// Create and export the model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;