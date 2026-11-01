import { Request, Response, NextFunction } from 'express';
import { budgetService } from '../services/budget.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await budgetService.getEventBudget(req.params.eventId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function addExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = await budgetService.addExpense(req.params.eventId, req.body);
    sendSuccess(res, expense, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { expenseId } = req.params;
    const eventId = req.params.eventId || req.body.eventId;
    const expense = await budgetService.updateExpense(expenseId, eventId, req.body);
    sendSuccess(res, expense);
  } catch (err) {
    next(err);
  }
}

export async function deleteExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const { expenseId } = req.params;
    const eventId = req.params.eventId || (req.query.eventId as string);
    const deleted = await budgetService.deleteExpense(expenseId, eventId);
    sendSuccess(res, { deleted });
  } catch (err) {
    next(err);
  }
}

