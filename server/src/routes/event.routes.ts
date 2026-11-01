import { Router } from 'express';
import { validateBody } from '../middleware/validation.middleware.js';
import { createEventSchema, updateEventSchema } from '../schemas/event.schema.js';
import * as eventController from '../controllers/event.controller.js';

const router = Router();

router.get('/', eventController.getEvents);
router.post('/', validateBody(createEventSchema), eventController.createEvent);
router.get('/:id', eventController.getEventById);
router.put('/:id', validateBody(updateEventSchema), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;

