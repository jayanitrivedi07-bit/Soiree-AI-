import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error Middleware]', err);

  if (err instanceof AppError) {
    sendError(res, err.message, err.code, err.statusCode, err.details);
    return;
  }

  // Generic internal server error
  const message = env.isProduction ? 'An unexpected error occurred' : err.message;
  sendError(res, message, 'INTERNAL_SERVER_ERROR', 500);
}

