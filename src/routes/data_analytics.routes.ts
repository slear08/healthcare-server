import express from 'express';

import { getDataAnalyticsController } from '../controllers/dashboard/get_data_analytics.controller';

const router = express.Router();
router.get('/dashboard', getDataAnalyticsController);

export default router;
