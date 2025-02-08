import express from 'express';

import { createQueueController } from '../controllers/queue/create_queue.controller';
import { getQueueListController } from '../controllers/queue/get_queue_list.controller';

const router = express.Router();

router.get('/create', createQueueController);
router.get('/list', getQueueListController);

export default router;
