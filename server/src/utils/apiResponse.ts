import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  messageOrStatus: string | number = 'Operation successful',
  statusCode = 200
): Response {
  let message = 'Operation successful';
  let status = statusCode;

  if (typeof messageOrStatus === 'number') {
    status = messageOrStatus;
  } else if (typeof messageOrStatus === 'string') {
    message = messageOrStatus;
  }

  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(status).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  code = 'INTERNAL_ERROR',
  statusCode = 500,
  details?: unknown
): Response {
  const payload: ApiResponse = {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };
  return res.status(statusCode).json(payload);
}

