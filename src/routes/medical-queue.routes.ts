import express from 'express';

import { createQueueController } from '../controllers/queue/create_queue.controller';
import { getQueueListController } from '../controllers/queue/get_queue_list.controller';
import { PassportAuthMiddleware } from '../middlewares/auth/passport_auth.middleware';

const router = express.Router();

router.get('/create', PassportAuthMiddleware, createQueueController);
router.get('/list', PassportAuthMiddleware, getQueueListController);

export default router;
