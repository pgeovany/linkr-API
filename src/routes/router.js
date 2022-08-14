import { Router } from 'express';
import authRouter from './authRouter.js';
import postsRouter from './postsRouter.js';
import usersRouter from './usersRouter.js';
import trendsRouter from './trendsRouter.js';

const router = Router();

router.use(authRouter);
router.use(postsRouter);
router.use(usersRouter);
router.use(trendsRouter);

export default router;
