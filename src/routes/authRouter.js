import { Router } from 'express';
import { logIn, logUp } from '../controllers/authController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import { loginSchema, logupSchema } from '../utils/schemas.js';

const authRouter = Router();

authRouter.post('/login', validateSchema(loginSchema), logIn);
authRouter.post('/logup', validateSchema(logupSchema), logUp);

export default authRouter;
