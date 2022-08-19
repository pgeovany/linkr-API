import { Router } from 'express';
import {
  getPosts,
  savePost,
  likePost,
  desLikePost,
  deletePost,
  editPost,
  repost,
} from '../controllers/postsController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';
import { bodyLikePost, editPostSchema, postsSchema } from '../utils/schemas.js';

const postsRouter = Router();

postsRouter.post(
  '/posts',
  tokenMiddleware,
  validateSchema(postsSchema),
  savePost
);

postsRouter.get('/posts', tokenMiddleware, getPosts);
postsRouter.delete('/posts/:postId', tokenMiddleware, deletePost);
postsRouter.put(
  '/posts/:postId',
  tokenMiddleware,
  validateSchema(editPostSchema),
  editPost
);

postsRouter.post(
  '/likes',
  tokenMiddleware,
  validateSchema(bodyLikePost),
  likePost
);

postsRouter.delete('/likes/:idPost', tokenMiddleware, desLikePost);

postsRouter.post('/repost/:postId', tokenMiddleware, repost);

export default postsRouter;
