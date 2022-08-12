import { Router } from 'express';
import { getTrends } from '../controllers/trendsController.js';

const trendsRouter = Router();

trendsRouter.get('/trending', getTrends);

export default trendsRouter;