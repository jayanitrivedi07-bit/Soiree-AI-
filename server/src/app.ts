import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import eventRoutes from './routes/event.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import taskRoutes from './routes/task.routes.js';
import { vendorRouter, eventVendorRouter } from './routes/vendor.routes.js';
import aiRoutes from './routes/ai.routes.js';
import * as budgetController from './controllers/budget.controller.js';
import * as taskController from './controllers/task.controller.js';
import { validateBody } from './middleware/validation.middleware.js';
import { updateExpenseSchema } from './schemas/budget.schema.js';
import { updateTaskSchema, updateTaskStatusSchema } from './schemas/task.schema.js';
import { sendSuccess } from './utils/apiResponse.js';

export const app = express();

// Security & Parsing Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost, vercel deployments, and undefined origin (curl/mobile/tools)
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for hackathon demo
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

// Global API rate limiter (excluding test environment)
if (!env.isTest) {
  app.use('/api', apiLimiter);
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Soirée AI Celebration Planning API',
    geminiConfigured: Boolean(env.GEMINI_API_KEY),
    supabaseConfigured: Boolean(env.SUPABASE_URL),
    env: env.NODE_ENV,
  });
});

// Primary Routes
app.use('/api/events', eventRoutes);
app.use('/api/events/:eventId', budgetRoutes);
app.use('/api/events/:eventId', taskRoutes);
app.use('/api/events/:eventId', eventVendorRouter);

// Flat routes for convenience
app.put('/api/expenses/:expenseId', validateBody(updateExpenseSchema), budgetController.updateExpense);
app.delete('/api/expenses/:expenseId', budgetController.deleteExpense);

app.put('/api/tasks/:taskId', validateBody(updateTaskSchema), taskController.updateTask);
app.delete('/api/tasks/:taskId', taskController.deleteTask);
app.patch('/api/tasks/:taskId/status', validateBody(updateTaskStatusSchema), taskController.updateTaskStatus);

app.use('/api/vendors', vendorRouter);
app.use('/api/ai', aiRoutes);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
    error: { code: 'NOT_FOUND' },
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;

