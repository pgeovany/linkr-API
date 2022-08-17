import { Router } from 'express';
import {
  followUser,
  searchUsers,
  unfollowUser,
} from '../controllers/usersController.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';

const usersRouter = Router();

usersRouter.get('/users', tokenMiddleware, searchUsers);
usersRouter.post(
  '/users/follow/:userToBeFollowed',
  tokenMiddleware,
  followUser
);
usersRouter.post(
  '/users/unfollow/:userToBeUnfollowed',
  tokenMiddleware,
  unfollowUser
);

export default usersRouter;
