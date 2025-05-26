import { Router } from 'express';
import UserController from '../controllers/userController';

const router = Router();
const userController = new UserController();

const setUserRoutes = (app) => {
    app.use('/api/users', router);
    
    router.get('/', userController.getUsers.bind(userController));
    router.post('/', userController.addUser.bind(userController));
    router.put('/:id', userController.editUser.bind(userController));
    router.delete('/:id', userController.deleteUser.bind(userController));
};

export default setUserRoutes;