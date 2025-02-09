import express from 'express';

import {
  createQueueController,
  getActiveQueueByUserIdController,
  getQueueHistoryByUserController,
  getQueueListController,
  updateQueueLimitController,
  updateUserQueueStatusController,
} from '../controllers/queue';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
import { PassportAuthMiddleware } from '../middlewares/auth/passport_auth.middleware';

const router = express.Router();

// USER
router.get('/create', PassportAuthMiddleware, createQueueController);
router.get(
  '/user-list',
  PassportAuthMiddleware,
  getActiveQueueByUserIdController
);
router.get(
  '/user/history-list',
  PassportAuthMiddleware,
  getQueueHistoryByUserController
);

// ADMIN
// SAMPLE request for list
// GET /list?status=pending&sort=createdAt:desc
// GET /list?status=in-progress
// GET /list?sort=priority:asc
// GET /queue?page=1&limit=20
// GET /queue?status=pending&sort=createdAt:desc&page=2&limit=15

router.get('/list', AuthMiddleware, getQueueListController);

router.put('/update-queue', AuthMiddleware, updateQueueLimitController);
router.put(
  '/user-list/update/:userId/:queueId',
  AuthMiddleware,
  updateUserQueueStatusController
);

export default router;
