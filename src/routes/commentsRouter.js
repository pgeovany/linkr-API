import { Router } from 'express';
import { postComment, getPostComments } from '../controllers/commentController.js';

import tokenMiddleware from '../middlewares/tokenMiddleware.js';
import validateSchema from '../middlewares/schemaValidator.js';
import { commentSchema } from '../utils/schemas.js';

const commentsRouter = Router();

commentsRouter.post('/comments/:postId', validateSchema(commentSchema), tokenMiddleware, postComment);
commentsRouter.get('/comments/:postId', tokenMiddleware, getPostComments);


export default commentsRouter;