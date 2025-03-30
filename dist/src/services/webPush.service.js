"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const web_push_1 = __importDefault(require("web-push"));
// Generate VAPID keys using webpush.generateVAPIDKeys()
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
};
web_push_1.default.setVapidDetails('mailto:your-email@example.com', vapidKeys.publicKey, vapidKeys.privateKey);
const sendPushNotification = async (subscription, reminder) => {
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
        await web_push_1.default.sendNotification(subscription, payload);
        return true;
    }
    catch (error) {
        console.error('Error sending push notification:', error);
        return false;
    }
};
exports.sendPushNotification = sendPushNotification;
