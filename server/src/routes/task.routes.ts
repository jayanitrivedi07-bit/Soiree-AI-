import { Router } from 'express';
import { validateBody } from '../middleware/validation.middleware.js';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from '../schemas/task.schema.js';
import * as taskController from '../controllers/task.controller.js';

const router = Router({ mergeParams: true });

// Event-nested endpoints: /api/events/:eventId/...
router.get('/tasks', taskController.getTasks);
router.post('/tasks', validateBody(createTaskSchema), taskController.addTask);
router.put('/tasks/:taskId', validateBody(updateTaskSchema), taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);
router.patch('/tasks/:taskId/status', validateBody(updateTaskStatusSchema), taskController.updateTaskStatus);

export default router;

