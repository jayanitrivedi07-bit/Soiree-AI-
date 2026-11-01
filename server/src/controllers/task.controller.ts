import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await taskService.getTasks(req.params.eventId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function addTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.addTask(req.params.eventId, req.body);
    sendSuccess(res, task, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const eventId = req.params.eventId || req.body.eventId;
    const task = await taskService.updateTask(taskId, eventId, req.body);
    sendSuccess(res, task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const eventId = req.params.eventId || (req.query.eventId as string);
    const deleted = await taskService.deleteTask(taskId, eventId);
    sendSuccess(res, { deleted });
  } catch (err) {
    next(err);
  }
}

export async function updateTaskStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const eventId = req.params.eventId || req.body.eventId;
    const { done } = req.body;
    const task = await taskService.toggleTaskStatus(taskId, eventId, Boolean(done));
    sendSuccess(res, task);
  } catch (err) {
    next(err);
  }
}

