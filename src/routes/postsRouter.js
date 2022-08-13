import { Router } from 'express';
import {
  getPosts,
  savePost,
  likePost,
} from '../controllers/postsController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';
import { bodyLikePost, postsSchema } from '../utils/schemas.js';

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
  validateSchema(bodyLikePost),
  likePost
);

export default postsRouter;
