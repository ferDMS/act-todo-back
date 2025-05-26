import { Request, Response } from 'express';
import Task from '../models/Task.js';

interface TodoBody {
    text: string;
    priority?: 'low' | 'medium' | 'high';
    completed?: boolean;
}

// Get all tasks
export const getAllTasks = async (_req: Request, res: Response) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

// Create a new task
export const createTask = async (req: Request<{}, {}, TodoBody>, res: Response) => {
    try {
        const { text, priority = 'medium', completed = false } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }

        const task = await Task.create({
            text,
            priority,
            completed
        });
        
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task', error });
    }
};

// Update a task
export const updateTask = async (req: Request<{ id: string }, {}, TodoBody>, res: Response) => {
    try {
        const { id } = req.params;
        const { text, priority, completed } = req.body;
        
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.update({ 
            text: text || task.text,
            priority: priority || task.priority,
            completed: completed !== undefined ? completed : task.completed
        });
        
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error updating task', error });
    }
};

// Toggle task completion status
export const toggleTaskStatus = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.update({ completed: !task.completed });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error toggling task status', error });
    }
};

// Delete a task
export const deleteTask = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting task', error });
    }
};