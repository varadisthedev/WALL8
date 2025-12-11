// middleware/auth.js
const { requireAuth } = require('@clerk/express');
const User = require('../models/User');

// Middleware to extract user ID from Clerk auth and finding local user
const extractUserId = async (req, res, next) => {
    try {
        const { userId } = req.auth;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No user ID found'
            });
        }

        // Attach clerk ID to request
        req.userId = userId;

        // Find local user
        const user = await User.findOne({ clerkId: userId });

        if (user) {
            req.user = user;
        }

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

// Middleware to ensure profile is completed
const requireProfile = async (req, res, next) => {
    try {
        const user = req.user || await User.findOne({ clerkId: req.userId });

        if (!user || !user.profileCompleted) {
            return res.status(403).json({
                success: false,
                message: 'Profile incomplete. Please complete onboarding first.',
                requiresOnboarding: true
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Profile check error'
        });
    }
};

module.exports = {
    requireAuth: requireAuth(),
    extractUserId,
    requireProfile
};
