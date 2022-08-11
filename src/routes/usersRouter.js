import { Router } from 'express';
import { searchUsers } from '../controllers/usersController.js';

const usersRouter = Router();

usersRouter.get('/users', searchUsers);

export default usersRouter;
