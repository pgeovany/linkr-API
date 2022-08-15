import { Router } from 'express';
import {
  getPosts,
  savePost,
  likePost,
  desLikePost,
  deletePost,
  editPost,
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

postsRouter.delete('/posts/:postId', tokenMiddleware, deletePost);

postsRouter.patch(
  '/posts/:postId',
  tokenMiddleware,
  validateSchema(postsSchema),
  editPost
);

export default postsRouter;
