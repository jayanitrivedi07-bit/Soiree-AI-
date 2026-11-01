import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function generatePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const plan = await aiService.generateEventPlan(req.body.eventId);
    sendSuccess(res, plan);
  } catch (err) {
    next(err);
  }
}

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId, message, history } = req.body;
    const result = await aiService.chat(eventId, message, history ?? []);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getBudgetSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId, customBudget, guestCount } = req.body;
    const result = await aiService.generateBudgetSuggestions(eventId, customBudget, guestCount);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function generateTimeline(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await aiService.generateTimeline(req.body.eventId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getChatHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const messages = await aiService.getChatHistory(req.params.eventId);
    sendSuccess(res, messages);
  } catch (err) {
    next(err);
  }
}

