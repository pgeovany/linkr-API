import { Router } from 'express';
import { searchUsers } from '../controllers/usersController.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';

const usersRouter = Router();

usersRouter.get('/users', tokenMiddleware, searchUsers);

export default usersRouter;
