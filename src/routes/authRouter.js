import { Router } from 'express';
import { logOut } from '../controllers/authController.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';

const authRouter = Router();

authRouter.post('/logout', tokenMiddleware, logOut);

export default authRouter;
