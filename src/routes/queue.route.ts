import { RequestHandler, Router } from 'express';

import { getQueueLimitController } from '../controllers/queue/get_queue_limit.controller';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';

const router = Router();

router.get(
  '/settings',
  AuthMiddleware,
  getQueueLimitController as RequestHandler
);

export default router;
