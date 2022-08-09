import { Router } from 'express';
import { logOut } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/logout', logOut);

export default authRouter;
