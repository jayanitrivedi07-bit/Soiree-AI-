import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(2, 'Task title is required'),
  category: z.string().min(1, 'Category is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  done: z.boolean().default(false),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({
  done: z.boolean(),
  eventId: z.string().optional(),
});

