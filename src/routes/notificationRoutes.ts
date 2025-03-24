import express, { RequestHandler } from 'express';

import {
  getVapidPublicKey,
  sendNotification,
  subscribe,
} from '../controllers/notificationController';

const router = express.Router();

router.get('/vapid-public-key', getVapidPublicKey as RequestHandler);
router.post('/subscribe', subscribe as RequestHandler);
router.post('/send', sendNotification as RequestHandler);

export default router;
