import { Router } from 'express';
import { logOut, logIn, logUp } from '../controllers/authController.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';

const authRouter = Router();

authRouter.post('/logout', tokenMiddleware, logOut);
authRouter.post('/login', logIn);
authRouter.post('/logup', logUp);

export default authRouter;
