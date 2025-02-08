import express from 'express';

import {
  createQueueController,
  getQueueByUserController,
  getQueueListController,
  updateQueueLimitController,
  updateUserQueueStatusController,
} from '../controllers/queue';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
import { PassportAuthMiddleware } from '../middlewares/auth/passport_auth.middleware';

const router = express.Router();

router.get('/create', PassportAuthMiddleware, createQueueController);
router.get('/user-list', PassportAuthMiddleware, getQueueByUserController);

router.get('/list', AuthMiddleware, getQueueListController);
router.put('/update-queue', AuthMiddleware, updateQueueLimitController);
router.put(
  '/user-list/update/:userId/:queueId',
  AuthMiddleware,
  updateUserQueueStatusController
);

export default router;
