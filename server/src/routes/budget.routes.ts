import { Router } from 'express';
import { validateBody } from '../middleware/validation.middleware.js';
import { createExpenseSchema, updateExpenseSchema } from '../schemas/budget.schema.js';
import * as budgetController from '../controllers/budget.controller.js';

const router = Router({ mergeParams: true });

// Event-nested endpoints: /api/events/:eventId/...
router.get('/budget', budgetController.getBudget);
router.get('/expenses', budgetController.getBudget);
router.post('/expenses', validateBody(createExpenseSchema), budgetController.addExpense);
router.put('/expenses/:expenseId', validateBody(updateExpenseSchema), budgetController.updateExpense);
router.delete('/expenses/:expenseId', budgetController.deleteExpense);

export default router;

