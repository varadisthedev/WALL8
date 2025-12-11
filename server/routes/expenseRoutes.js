
const express = require('express');
const router = express.Router();
const { requireAuth, extractUserId, requireProfile } = require('../middleware/auth');
const {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');


router.use(requireAuth);
router.use(extractUserId);
router.use(requireProfile); 


router.post('/', addExpense);


router.get('/', getAllExpenses);


router.get('/:id', getExpenseById);


router.put('/:id', updateExpense);


router.delete('/:id', deleteExpense);

module.exports = router;
