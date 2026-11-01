import { z } from 'zod';

export const createExpenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  estimated: z.number().min(0, 'Estimated amount cannot be negative'),
  actual: z.number().min(0, 'Actual amount cannot be negative').nullable().optional(),
  status: z.enum(['paid', 'contracted', 'pending', 'reserved']).default('pending'),
});

export const updateExpenseSchema = createExpenseSchema.partial();

