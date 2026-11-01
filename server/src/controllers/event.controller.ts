import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/event.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eventService.getEvents();
    sendSuccess(res, events);
  } catch (err) {
    next(err);
  }
}

export async function getEventById(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventService.getEventById(req.params.id);
    sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventService.createEvent(req.body);
    sendSuccess(res, event, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await eventService.deleteEvent(req.params.id);
    sendSuccess(res, { deleted });
  } catch (err) {
    next(err);
  }
}

