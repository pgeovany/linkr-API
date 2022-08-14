import { Router } from 'express';
import {
  getPosts,
  savePost,
  likePost,
  desLikePost,
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
postsRouter.delete('/likes/:idPost', tokenMiddleware, desLikePost);

export default postsRouter;
