import cron from 'node-cron';
import { PushSubscription } from 'web-push';

import MedicineReminder from '../models/medicine_reminder.model';
import PushSubscriptionModel from '../models/push_subscription.model';
import log from '../utils/logger';
import { sendPushNotification } from './webPush.service';

export const addUserSubscription = async (
  userId: string,
  subscription: PushSubscription
) => {
  try {
    log.info(`Adding subscription for user: ${userId}`);
    const result = await PushSubscriptionModel.findOneAndUpdate(
      { userId },
      { subscription },
      { upsert: true, new: true }
    );
    log.info(`Subscription saved: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    log.error('Error adding subscription:', error);
    throw error;
  }
};

export const removeUserSubscription = async (userId: string) => {
  try {
    log.info(`Removing subscription for user: ${userId}`);
    const result = await PushSubscriptionModel.findOneAndDelete({ userId });
    log.info(`Subscription removed: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    log.error('Error removing subscription:', error);
    throw error;
  }
};

const checkMedicineReminders = async () => {
  try {
    log.info('Checking medicine reminders...');
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    log.info(`Current time: ${currentTime}`);

    // Find all reminders that match current time
    const reminders = await MedicineReminder.find({
      $or: [
        // For everyday reminders
        {
          isEveryday: true,
          time: currentTime,
        },
        // For specific date reminders
        {
          isEveryday: false,
          reminderDate: {
            $gte: now.setHours(0, 0, 0, 0),
            $lt: now.setHours(23, 59, 59, 999),
          },
          time: currentTime,
        },
      ],
    });

    log.info(`Found ${reminders.length} reminders for current time`);
    log.info(`Reminders: ${JSON.stringify(reminders)}`);

    // Get all subscriptions for debugging
    const allSubscriptions = await PushSubscriptionModel.find({});
    log.info(
      `All subscriptions in database: ${JSON.stringify(allSubscriptions)}`
    );

    // Send notifications for each matching reminder
    for (const reminder of reminders) {
      log.info(`Checking subscription for reminder user: ${reminder.userId}`);
      const subscriptionDoc = await PushSubscriptionModel.findOne({
        userId: reminder.userId,
      });

      if (subscriptionDoc) {
        log.info(`Found subscription for user: ${reminder.userId}`);
        log.info(`Subscription details: ${JSON.stringify(subscriptionDoc)}`);
        const sent = await sendPushNotification(
          subscriptionDoc.subscription,
          reminder
        );
        if (sent) {
          log.info(`Successfully sent notification for: ${reminder.name}`);
        } else {
          log.error(`Failed to send notification for: ${reminder.name}`);
        }
      } else {
        log.warn(`No subscription found for user: ${reminder.userId}`);
        log.warn(
          `Available user IDs in subscriptions: ${allSubscriptions.map((s) => s.userId).join(', ')}`
        );
      }
    }
  } catch (error) {
    log.error('Error checking medicine reminders:', error);
  }
};

// Run every minute
export const startCronJob = () => {
  cron.schedule('* * * * *', checkMedicineReminders);
  log.info('Medicine reminder cron job started');
};

export { checkMedicineReminders };
