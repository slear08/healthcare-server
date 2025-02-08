import express from 'express';

import {
  createQueueController,
  getQueueByUserController,
  getQueueListController,
  updateQueueLimitController,
} from '../controllers/queue';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
import { PassportAuthMiddleware } from '../middlewares/auth/passport_auth.middleware';

const router = express.Router();

router.get('/create', PassportAuthMiddleware, createQueueController);
router.get('/user-list', PassportAuthMiddleware, getQueueByUserController);

router.get('/list', AuthMiddleware, getQueueListController);
router.get('/update-queue', AuthMiddleware, updateQueueLimitController);

export default router;
