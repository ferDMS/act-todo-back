import { Request, Response } from 'express';
import { TodoModel } from '../models/Task';
import { Todo } from '../types';

// In-memory storage for todos (replace with database in production)
let todos: Todo[] = [];

class TodoController {
    async getTodos(req: Request, res: Response) {
        try {
            res.send(todos);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving todos', error });
        }
    }

    async addTodo(req: Request, res: Response) {
        const { id, text, completed, priority, createdAt }: { id?: string; text: string; completed?: boolean; priority?: "low" | "medium" | "high"; createdAt?: string } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }

        const newTodo: Todo = {
            id: id || Date.now().toString(), // Use provided ID or generate one
            text,
            completed: completed || false,
            priority: priority || 'medium',
            createdAt: createdAt ? new Date(createdAt) : new Date()
        };

        try {
            todos.push(newTodo);
            res.status(201).send({ message: 'Todo created' });
        } catch (error) {
            res.status(500).json({ message: 'Error adding todo', error });
        }
    }

    async editTodo(req: Request, res: Response) {
        const { id } = req.params;
        const { text, completed, priority }: Partial<Todo> = req.body;

        try {
            const todoIndex = todos.findIndex(todo => todo.id === id);
            if (todoIndex === -1) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            // Update the todo with new values
            if (text !== undefined) todos[todoIndex].text = text;
            if (completed !== undefined) todos[todoIndex].completed = completed;
            if (priority !== undefined) todos[todoIndex].priority = priority;
            
            res.send({ message: 'Todo updated' });
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
            res.send({ message: 'Todo deleted' });
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