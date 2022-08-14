import { Router } from 'express';
import {
  getPosts,
  reactToPost,
  savePost,
} from '../controllers/postsController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';
import { postsSchema, likeSchema } from '../utils/schemas.js';

const postsRouter = Router();

postsRouter.post(
  '/posts',
  tokenMiddleware,
  validateSchema(postsSchema),
  savePost
);

postsRouter.get('/posts', tokenMiddleware, getPosts);

postsRouter.post(
  '/likes',
  tokenMiddleware,
  validateSchema(likeSchema),
  reactToPost
);

export default postsRouter;
