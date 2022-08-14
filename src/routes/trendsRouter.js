import { Router } from 'express';
import { getTrends, getTrendByName } from '../controllers/trendsController.js';
import tokenMiddleware from '../middlewares/tokenMiddleware.js';

const trendsRouter = Router();

trendsRouter.get('/trending', tokenMiddleware, getTrends);
trendsRouter.get('/trending/:name', tokenMiddleware, getTrendByName);

export default trendsRouter;