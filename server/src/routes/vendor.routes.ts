import { Router } from 'express';
import { validateBody } from '../middleware/validation.middleware.js';
import { createVendorSchema, updateVendorStatusSchema } from '../schemas/vendor.schema.js';
import * as vendorController from '../controllers/vendor.controller.js';

// Router for global vendors: /api/vendors
export const vendorRouter = Router();
vendorRouter.get('/', vendorController.getAllVendors);
vendorRouter.get('/:id', vendorController.getVendorById);

// Router for event-scoped vendors: /api/events/:eventId/vendors
export const eventVendorRouter = Router({ mergeParams: true });
eventVendorRouter.get('/vendors', vendorController.getEventVendors);
eventVendorRouter.post('/vendors', validateBody(createVendorSchema), vendorController.addVendorToEvent);
eventVendorRouter.delete('/vendors/:vendorId', vendorController.removeVendorFromEvent);
eventVendorRouter.patch('/vendors/:vendorId/status', validateBody(updateVendorStatusSchema), vendorController.updateVendorStatus);

export default vendorRouter;

