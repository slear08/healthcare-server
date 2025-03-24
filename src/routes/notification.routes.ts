import express, { RequestHandler } from 'express';

import { UserInterface } from '../models/user.model';
import {
  addUserSubscription,
  checkMedicineReminders,
  removeUserSubscription,
} from '../services/cron.service';
import log from '../utils/logger';

const router = express.Router();

router.post('/subscribe', (async (req, res) => {
  try {
    const { _id } = req.user as UserInterface;
    const { subscription } = req.body;

    log.info(`Received subscription request for user: ${_id}`);
    log.info(`Subscription data: ${JSON.stringify(subscription)}`);

    if (!subscription) {
      log.error('Missing subscription data for user:', _id);
      return res.status(400).json({ error: 'Missing subscription data' });
    }

    log.info(`Processing subscription for user: ${_id}`);
    const result = await addUserSubscription(_id.toString(), subscription);
    log.info(`Successfully added subscription for user: ${_id}`);
    log.info(`Subscription result: ${JSON.stringify(result)}`);
    res.status(201).json({ message: 'Subscription added successfully' });
  } catch (error) {
    log.error('Error adding subscription:', error);
    res.status(500).json({ error: 'Failed to add subscription' });
  }
}) as RequestHandler);

router.delete('/unsubscribe', (async (req, res) => {
  try {
    const { _id } = req.user as UserInterface;
    log.info(`Processing unsubscribe for user: ${_id}`);
    const result = await removeUserSubscription(_id.toString());
    log.info(`Successfully removed subscription for user: ${_id}`);
    log.info(`Unsubscribe result: ${JSON.stringify(result)}`);
    res.status(200).json({ message: 'Subscription removed successfully' });
  } catch (error) {
    log.error('Error removing subscription:', error);
    res.status(500).json({ error: 'Failed to remove subscription' });
  }
}) as RequestHandler);

// Test endpoint to trigger notifications manually
router.post('/test-notification', (async (req, res) => {
  try {
    log.info('Manual notification test triggered');
    await checkMedicineReminders();
    log.info('Manual notification test completed');
    res.status(200).json({ message: 'Test notification check completed' });
  } catch (error) {
    log.error('Error testing notifications:', error);
    res.status(500).json({ error: 'Failed to test notifications' });
  }
}) as RequestHandler);

export default router;
