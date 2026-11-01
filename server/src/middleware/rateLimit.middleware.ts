import rateLimit from 'express-rate-limit';

// Rate limiter for general API requests (120 requests per minute)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again shortly.',
    error: { code: 'RATE_LIMIT_EXCEEDED' },
  },
});

// Stricter rate limiter for Gemini AI endpoints (30 requests per minute)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please pause a moment before generating additional plans.',
    error: { code: 'AI_RATE_LIMIT_EXCEEDED' },
  },
});

