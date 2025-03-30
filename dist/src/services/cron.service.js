"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMedicineReminders = exports.startCronJob = exports.removeUserSubscription = exports.addUserSubscription = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const medicine_reminder_model_1 = __importDefault(require("../models/medicine_reminder.model"));
const push_subscription_model_1 = __importDefault(require("../models/push_subscription.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const sms_1 = require("../utils/sms");
const webPush_service_1 = require("./webPush.service");
const addUserSubscription = async (userId, subscription) => {
    try {
        logger_1.default.info(`Adding subscription for user: ${userId}`);
        const result = await push_subscription_model_1.default.findOneAndUpdate({ userId }, { subscription }, { upsert: true, new: true });
        logger_1.default.info(`Subscription saved: ${JSON.stringify(result)}`);
        return result;
    }
    catch (error) {
        logger_1.default.error('Error adding subscription:', error);
        throw error;
    }
};
exports.addUserSubscription = addUserSubscription;
const removeUserSubscription = async (userId) => {
    try {
        logger_1.default.info(`Removing subscription for user: ${userId}`);
        const result = await push_subscription_model_1.default.findOneAndDelete({ userId });
        logger_1.default.info(`Subscription removed: ${JSON.stringify(result)}`);
        return result;
    }
    catch (error) {
        logger_1.default.error('Error removing subscription:', error);
        throw error;
    }
};
exports.removeUserSubscription = removeUserSubscription;
const checkMedicineReminders = async () => {
    try {
        logger_1.default.info('Checking medicine reminders...');
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        });
        logger_1.default.info(`Current time: ${currentTime}`);
        // Find all reminders that match current time
        const reminders = await medicine_reminder_model_1.default.find({
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
        logger_1.default.info(`Found ${reminders.length} reminders for current time`);
        logger_1.default.info(`Reminders: ${JSON.stringify(reminders)}`);
        // Get all subscriptions for debugging
        const allSubscriptions = await push_subscription_model_1.default.find({});
        logger_1.default.info(`All subscriptions in database: ${JSON.stringify(allSubscriptions)}`);
        // Send notifications for each matching reminder
        for (const reminder of reminders) {
            logger_1.default.info(`Checking subscription for reminder user: ${reminder.userId}`);
            const subscriptionDoc = await push_subscription_model_1.default.findOne({
                userId: reminder.userId,
            });
            if (subscriptionDoc) {
                logger_1.default.info(`Found subscription for user: ${reminder.userId}`);
                logger_1.default.info(`Subscription details: ${JSON.stringify(subscriptionDoc)}`);
                const sent = await (0, webPush_service_1.sendPushNotification)(subscriptionDoc.subscription, reminder);
                await (0, sms_1.SendSMSUtil)(reminder.userId, reminder.name);
                if (sent) {
                    logger_1.default.info(`Successfully sent notification for: ${reminder.name}`);
                }
                else {
                    logger_1.default.error(`Failed to send notification for: ${reminder.name}`);
                }
            }
            else {
                logger_1.default.warn(`No subscription found for user: ${reminder.userId}`);
                logger_1.default.warn(`Available user IDs in subscriptions: ${allSubscriptions.map((s) => s.userId).join(', ')}`);
            }
        }
    }
    catch (error) {
        logger_1.default.error('Error checking medicine reminders:', error);
    }
};
exports.checkMedicineReminders = checkMedicineReminders;
// Run every minute
const startCronJob = () => {
    node_cron_1.default.schedule('* * * * *', checkMedicineReminders);
    logger_1.default.info('Medicine reminder cron job started');
};
exports.startCronJob = startCronJob;
