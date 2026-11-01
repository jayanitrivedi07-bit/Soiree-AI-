import { Router } from 'express';
import { validateBody } from '../middleware/validation.middleware.js';
import { generatePlanSchema, chatSchema, budgetSuggestionsSchema, generateTimelineSchema } from '../schemas/ai.schema.js';
import * as aiController from '../controllers/ai.controller.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/generate-plan', aiLimiter, validateBody(generatePlanSchema), aiController.generatePlan);
router.post('/chat', aiLimiter, validateBody(chatSchema), aiController.chat);
router.post('/budget-suggestions', aiLimiter, validateBody(budgetSuggestionsSchema), aiController.getBudgetSuggestions);
router.post('/generate-timeline', aiLimiter, validateBody(generateTimelineSchema), aiController.generateTimeline);
router.get('/chat-history/:eventId', aiController.getChatHistory);

export default router;

