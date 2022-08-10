import { Router } from 'express';
import { logOut, logIn } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/logout', logOut);
authRouter.post('/login', logIn);

export default authRouter;
