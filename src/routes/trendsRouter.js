import { Router } from 'express';
import { getTrends, getTrendsByName } from '../controllers/trendsController.js';

const trendsRouter = Router();

trendsRouter.get('/trending', getTrends);
trendsRouter.get('/trending/:name', getTrendsByName);

export default trendsRouter;