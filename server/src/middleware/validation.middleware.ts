import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse.js';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        return sendError(res, 'Validation failed for request data', 'VALIDATION_ERROR', 400, issues);
      }
      return sendError(res, 'Invalid request payload', 'VALIDATION_ERROR', 400);
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        return sendError(res, 'Invalid URL parameters', 'VALIDATION_ERROR', 400, issues);
      }
      return sendError(res, 'Invalid URL parameters', 'VALIDATION_ERROR', 400);
    }
  };
}

