import { Router } from 'express';
import type { RequestHandler } from 'express';
import {
    getAllTasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask
} from '../controllers/taskController.js';

interface TodoParams {
    id: string;
}

interface TodoBody {
    text: string;
    priority?: 'low' | 'medium' | 'high';
    completed?: boolean;
}

const router = Router();

// Get all todos
router.get('/', getAllTasks as RequestHandler);

// Create a new todo
router.post('/', createTask as RequestHandler<{}, any, TodoBody>);

// Update a todo
router.put('/:id', updateTask as RequestHandler<TodoParams, any, TodoBody>);

// Toggle todo completion status
router.patch('/:id/toggle', toggleTaskStatus as RequestHandler<TodoParams>);

// Delete a todo
router.delete('/:id', deleteTask as RequestHandler<TodoParams>);

export default router;