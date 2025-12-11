// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    profile: {
        age: {
            type: Number,
            min: [13, 'Age must be at least 13'],
            max: [100, 'Age must be less than 100']
        },
        monthlyAllowance: {
            type: Number,
            min: [0, 'Monthly allowance must be positive']
        },
        institution: {
            type: String,
            trim: true
        },
        course: {
            type: String,
            trim: true
        },
        year: {
            type: Number,
            min: 1,
            max: 6
        },
        city: {
            type: String,
            trim: true
        }
    },
    budget: {
        food: {
            type: Number,
            default: 0,
            min: 0
        },
        travel: {
            type: Number,
            default: 0,
            min: 0
        },
        shopping: {
            type: Number,
            default: 0,
            min: 0
        },
        entertainment: {
            type: Number,
            default: 0,
            min: 0
        },
        others: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    budgetPercentages: {
        food: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        travel: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        shopping: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        entertainment: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        others: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    preferences: {
        currency: {
            type: String,
            default: 'INR'
        },
        notifications: {
            type: Boolean,
            default: true
        },
        budgetAlerts: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Virtual: Check if budget is set
userSchema.virtual('hasBudget').get(function () {
    return this.profile.monthlyAllowance > 0;
});

// Virtual: Get total budget
userSchema.virtual('totalBudget').get(function () {
    return Object.values(this.budget).reduce((sum, val) => sum + val, 0);
});

// Instance method: Calculate AI-suggested budget
userSchema.methods.calculateAISuggestedBudget = function () {
    const allowance = this.profile.monthlyAllowance;

    // AI-powered budget allocation based on student needs
    const suggestions = {
        food: Math.round(allowance * 0.35), // 35% for food
        travel: Math.round(allowance * 0.15), // 15% for travel
        shopping: Math.round(allowance * 0.20), // 20% for shopping
        entertainment: Math.round(allowance * 0.15), // 15% for entertainment
        others: Math.round(allowance * 0.15) // 15% for savings/others
    };

    const percentages = {
        food: 35,
        travel: 15,
        shopping: 20,
        entertainment: 15,
        others: 15
    };

    return { budget: suggestions, percentages };
};

// Instance method: Set custom budget
userSchema.methods.setCustomBudget = function (percentages) {
    const allowance = this.profile.monthlyAllowance;

    // Validate percentages sum to 100
    const total = Object.values(percentages).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.01) {
        throw new Error('Budget percentages must sum to 100%');
    }

    // Calculate budget amounts
    this.budgetPercentages = percentages;
    this.budget = {
        food: Math.round((allowance * percentages.food) / 100),
        travel: Math.round((allowance * percentages.travel) / 100),
        shopping: Math.round((allowance * percentages.shopping) / 100),
        entertainment: Math.round((allowance * percentages.entertainment) / 100),
        others: Math.round((allowance * percentages.others) / 100)
    };
};

// Instance method: Update profile and recalculate budget
userSchema.methods.updateProfileAndBudget = async function (profileData) {
    this.profile = { ...this.profile, ...profileData };

    // If monthly allowance changed, recalculate budget
    if (profileData.monthlyAllowance) {
        const allowance = profileData.monthlyAllowance;
        Object.keys(this.budget).forEach(category => {
            const percentage = this.budgetPercentages[category] || 0;
            this.budget[category] = Math.round((allowance * percentage) / 100);
        });
    }

    this.profileCompleted = true;
    await this.save();
};

// Static method: Get or create user from Clerk
userSchema.statics.findOrCreateFromClerk = async function (clerkUser) {
    let user = await this.findOne({ clerkId: clerkUser.id });

    if (!user) {
        user = await this.create({
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            profileCompleted: false
        });
    }

    return user;
};

// Pre-save middleware: Ensure budget consistency
userSchema.pre('save', function (next) {
    if (this.isModified('profile.monthlyAllowance') && !this.isNew) {
        // Recalculate budget if allowance changed
        const allowance = this.profile.monthlyAllowance;
        Object.keys(this.budget).forEach(category => {
            const percentage = this.budgetPercentages[category] || 0;
            this.budget[category] = Math.round((allowance * percentage) / 100);
        });
    }
    next();
});

module.exports = mongoose.model('User', userSchema);