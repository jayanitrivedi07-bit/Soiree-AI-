import { Request, Response, NextFunction } from 'express';
import { vendorService } from '../services/vendor.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getAllVendors(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    const vendors = await vendorService.getAllVendors(category);
    sendSuccess(res, vendors);
  } catch (err) {
    next(err);
  }
}

export async function getVendorById(req: Request, res: Response, next: NextFunction) {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    sendSuccess(res, vendor);
  } catch (err) {
    next(err);
  }
}

export async function getEventVendors(req: Request, res: Response, next: NextFunction) {
  try {
    const vendors = await vendorService.getEventVendors(req.params.eventId);
    sendSuccess(res, vendors);
  } catch (err) {
    next(err);
  }
}

export async function addVendorToEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const vendor = await vendorService.addVendorToEvent(req.params.eventId, req.body);
    sendSuccess(res, vendor, 201);
  } catch (err) {
    next(err);
  }
}

export async function removeVendorFromEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId, vendorId } = req.params;
    const removed = await vendorService.removeVendorFromEvent(eventId, vendorId);
    sendSuccess(res, { removed });
  } catch (err) {
    next(err);
  }
}

export async function updateVendorStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId, vendorId } = req.params;
    const vendor = await vendorService.updateVendorStatus(eventId, vendorId, req.body.status);
    sendSuccess(res, vendor);
  } catch (err) {
    next(err);
  }
}

