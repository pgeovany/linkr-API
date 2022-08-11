import { Router } from 'express';
import { searchUsers } from '../controllers/usersController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';
import { searchSchema } from '../utils/schemas.js';

const usersRouter = Router();

usersRouter.get(
  '/users',
  tokenMiddleware,
  validateSchema(searchSchema),
  searchUsers
);

export default usersRouter;
