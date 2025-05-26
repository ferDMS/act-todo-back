import { Router } from 'express';
import TodoController from '../controllers/taskController';

const router = Router();

const setTodoRoutes = (app) => {
    app.use('/api/todos', router);

    router.get('/', TodoController.getTodos.bind(TodoController));
    router.post('/', TodoController.addTodo.bind(TodoController));
    router.put('/:id', TodoController.editTodo.bind(TodoController));
    router.delete('/:id', TodoController.deleteTodo.bind(TodoController));
    router.patch('/:id/complete', TodoController.completeTodo.bind(TodoController));
};

export default setTodoRoutes;