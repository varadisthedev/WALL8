// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, extractUserId } = require('../middleware/auth');
const {
    syncUser,
    getProfile,
    completeOnboarding,
    getAIBudgetSuggestion,
    updateBudget,
    getBudgetStatus,
    updateProfile
} = require('../controllers/userController');

// All routes require authentication
router.use(requireAuth);
router.use(extractUserId);

// POST /api/user/sync - Sync Clerk user
router.post('/sync', syncUser);

// GET /api/user/profile - Get profile
router.get('/profile', getProfile);

// POST /api/user/onboarding - Complete onboarding
router.post('/onboarding', completeOnboarding);

// GET /api/user/ai-budget-suggestion - Get AI suggestion
router.get('/ai-budget-suggestion', getAIBudgetSuggestion);

// PUT /api/user/budget - Update custom budget
router.put('/budget', updateBudget);

// GET /api/user/budget-status - Get budget status
router.get('/budget-status', getBudgetStatus);

// PUT /api/user/profile - Update profile
router.put('/profile', updateProfile);

module.exports = router;
