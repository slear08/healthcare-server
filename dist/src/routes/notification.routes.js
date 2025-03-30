"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cron_service_1 = require("../services/cron.service");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
router.post('/subscribe', (async (req, res) => {
    try {
        const { _id } = req.user;
        const { subscription } = req.body;
        logger_1.default.info(`Received subscription request for user: ${_id}`);
        logger_1.default.info(`Subscription data: ${JSON.stringify(subscription)}`);
        if (!subscription) {
            logger_1.default.error('Missing subscription data for user:', _id);
            return res.status(400).json({ error: 'Missing subscription data' });
        }
        logger_1.default.info(`Processing subscription for user: ${_id}`);
        const result = await (0, cron_service_1.addUserSubscription)(_id.toString(), subscription);
        logger_1.default.info(`Successfully added subscription for user: ${_id}`);
        logger_1.default.info(`Subscription result: ${JSON.stringify(result)}`);
        res.status(201).json({ message: 'Subscription added successfully' });
    }
    catch (error) {
        logger_1.default.error('Error adding subscription:', error);
        res.status(500).json({ error: 'Failed to add subscription' });
    }
}));
router.delete('/unsubscribe', (async (req, res) => {
    try {
        const { _id } = req.user;
        logger_1.default.info(`Processing unsubscribe for user: ${_id}`);
        const result = await (0, cron_service_1.removeUserSubscription)(_id.toString());
        logger_1.default.info(`Successfully removed subscription for user: ${_id}`);
        logger_1.default.info(`Unsubscribe result: ${JSON.stringify(result)}`);
        res.status(200).json({ message: 'Subscription removed successfully' });
    }
    catch (error) {
        logger_1.default.error('Error removing subscription:', error);
        res.status(500).json({ error: 'Failed to remove subscription' });
    }
}));
// Test endpoint to trigger notifications manually
router.post('/test-notification', (async (req, res) => {
    try {
        logger_1.default.info('Manual notification test triggered');
        await (0, cron_service_1.checkMedicineReminders)();
        logger_1.default.info('Manual notification test completed');
        res.status(200).json({ message: 'Test notification check completed' });
    }
    catch (error) {
        logger_1.default.error('Error testing notifications:', error);
        res.status(500).json({ error: 'Failed to test notifications' });
    }
}));
exports.default = router;
