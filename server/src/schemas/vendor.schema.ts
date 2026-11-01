import { z } from 'zod';

export const createVendorSchema = z.object({
  name: z.string().min(2, 'Vendor name is required'),
  category: z.string().min(1, 'Category is required'),
  contact: z.string().email('Valid email is required').or(z.string().min(3)),
  phone: z.string().optional().default('+91 98000 00000'),
  price: z.number().min(0, 'Estimated fee cannot be negative'),
  status: z.enum(['booked', 'contracted', 'inquiry', 'shortlisted']).default('shortlisted'),
  rating: z.number().min(1).max(5).optional().default(4.9),
  reviewsCount: z.number().int().min(0).optional().default(10),
  location: z.string().optional().default('India'),
  tagline: z.string().optional().default('Artisanal Celebration Specialist'),
  description: z.string().optional().default('Bespoke celebration services.'),
  image: z.string().url().optional(),
  gallery: z.array(z.string()).optional(),
  services: z.array(z.object({
    title: z.string(),
    price: z.number(),
    description: z.string()
  })).optional(),
  leadTime: z.string().optional().default('4 weeks advance booking'),
});

export const updateVendorStatusSchema = z.object({
  status: z.enum(['booked', 'contracted', 'inquiry', 'shortlisted']),
});

