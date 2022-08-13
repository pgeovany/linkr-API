import { Router } from 'express';
import { getTrends, getTrendByName } from '../controllers/trendsController.js';

const trendsRouter = Router();

trendsRouter.get('/trending', getTrends);
trendsRouter.get('/trending/:name', getTrendByName);

export default trendsRouter;