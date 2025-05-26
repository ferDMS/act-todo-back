import { Request, Response } from 'express';
import { TodoModel } from '../models/Task';
import { Todo } from '../types';

// In-memory storage for todos (replace with database in production)
let todos: Todo[] = [];

class TodoController {
    async getTodos(req: Request, res: Response) {
        try {
            res.status(200).json(todos);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving todos', error });
        }
    }

    async addTodo(req: Request, res: Response) {
        const { text, priority = 'medium' }: { text: string; priority?: "low" | "medium" | "high" } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }

        const newTodo: Todo = {
            id: Date.now().toString(), // Simple ID generation (use UUID in production)
            text,
            completed: false,
            priority,
            createdAt: new Date()
        };

        try {
            todos.push(newTodo);
            res.status(201).json(newTodo);
        } catch (error) {
            res.status(500).json({ message: 'Error adding todo', error });
        }
    }

    async editTodo(req: Request, res: Response) {
        const { id } = req.params;
        const updates: Partial<Todo> = req.body;

        try {
            const todoIndex = todos.findIndex(todo => todo.id === id);
            if (todoIndex === -1) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            // Update the todo with new values, keeping existing ones for unspecified fields
            todos[todoIndex] = { ...todos[todoIndex], ...updates };
            res.status(200).json(todos[todoIndex]);
        } catch (error) {
            res.status(500).json({ message: 'Error editing todo', error });
        }
    }

    async deleteTodo(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const todoIndex = todos.findIndex(todo => todo.id === id);
            if (todoIndex === -1) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            todos.splice(todoIndex, 1);
            res.status(200).json({ message: 'Todo deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting todo', error });
        }
    }
    async completeTodo(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const todoIndex = todos.findIndex(todo => todo.id === id);
            if (todoIndex === -1) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            todos[todoIndex].completed = true;
            res.status(200).json(todos[todoIndex]);
        } catch (error) {
            res.status(500).json({ message: 'Error completing todo', error });
        }
    }
}

export default new TodoController();