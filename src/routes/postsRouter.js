import { Router } from 'express';
import { savePost } from '../controllers/postsController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';
import { postsSchema } from '../utils/schemas.js';

const postsRouter = Router();

postsRouter.post(
  '/posts',
  tokenMiddleware,
  validateSchema(postsSchema),
  savePost
);

export default postsRouter;
