import { Router } from 'express';
import { postComment, getPostComments } from '../controllers/commentController.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';

const commentsRouter = Router();

commentsRouter.post('/comments/:postId', tokenMiddleware, postComment);
commentsRouter.get('/comments/:postId', tokenMiddleware, getPostComments);


export default commentsRouter;