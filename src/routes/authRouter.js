import { Router } from 'express';
import { logOut, logIn } from '../controllers/authController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';
import { loginSchema } from '../utils/schemas.js';

const authRouter = Router();


authRouter.post('/logout', tokenMiddleware, logOut);
authRouter.post('/login', validateSchema(loginSchema), logIn);


export default authRouter;
