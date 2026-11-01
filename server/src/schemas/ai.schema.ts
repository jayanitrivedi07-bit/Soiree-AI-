import { z } from 'zod';

export const generatePlanSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
});

export const chatSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
  message: z.string().min(1, 'message is required').max(1500, 'message is too long'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    text: z.string(),
  })).optional(),
});

export const budgetSuggestionsSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
  customBudget: z.number().positive().optional(),
  guestCount: z.number().int().positive().optional(),
});

export const generateTimelineSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
});

