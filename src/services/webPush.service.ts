import webpush, { PushSubscription } from 'web-push';

import { IMedicineReminder } from '../models/medicine_reminder.model';

// Generate VAPID keys using webpush.generateVAPIDKeys()
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const sendPushNotification = async (
  subscription: PushSubscription,
  reminder: IMedicineReminder
) => {
  try {
    const payload = JSON.stringify({
      title: 'Medicine Reminder',
      body: `Time to take ${reminder.numberToTake} ${reminder.name}`,
      icon: '/icon.png',
      badge: '/badge.png',
      data: {
        reminderId: reminder._id,
      },
    });
    await webpush.sendNotification(subscription, payload);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};
