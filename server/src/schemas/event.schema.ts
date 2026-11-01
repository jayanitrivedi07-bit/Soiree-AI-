import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters').max(200),
  type: z.string().min(2, 'Event type is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  location: z.string().min(2, 'Location is required').max(255),
  guestCount: z.number().int().positive('Guest count must be at least 1'),
  budget: z.number().positive('Budget must be greater than ₹ 0'),
  currency: z.string().default('INR'),
  theme: z.string().min(2, 'Theme is required'),
  dietary: z.string().optional().default('Standard luxury banquet service'),
  notes: z.string().optional().default(''),
});

export const updateEventSchema = createEventSchema.partial();

