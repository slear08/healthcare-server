"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const globals_1 = require("@jest/globals");
const push_subscription_model_1 = __importDefault(require("../../models/push_subscription.model"));
const cron_service_1 = require("../cron.service");
// Mock dependencies
globals_1.jest.mock('node-cron');
globals_1.jest.mock('../../models/push_subscription.model');
globals_1.jest.mock('../webPush.service', () => ({
    sendPushNotification: globals_1.jest.fn().mockImplementation(async () => true),
}));
describe('Cron Service', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    describe('addUserSubscription', () => {
        it('should add a new subscription', async () => {
            const mockUserId = 'test-user-id';
            const mockSubscription = {
                endpoint: 'test-endpoint',
                keys: {
                    p256dh: 'test-p256dh',
                    auth: 'test-auth',
                },
            };
            const mockResult = {
                userId: mockUserId,
                subscription: mockSubscription,
            };
            const mockFindOneAndUpdate = push_subscription_model_1.default.findOneAndUpdate;
            mockFindOneAndUpdate.mockResolvedValue(mockResult);
            const result = await (0, cron_service_1.addUserSubscription)(mockUserId, mockSubscription);
            expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ userId: mockUserId }, { subscription: mockSubscription }, { upsert: true, new: true });
            expect(result).toEqual(mockResult);
        });
        it('should throw error when adding subscription fails', async () => {
            const mockError = new Error('Database error');
            const mockFindOneAndUpdate = push_subscription_model_1.default.findOneAndUpdate;
            mockFindOneAndUpdate.mockRejectedValue(mockError);
            const mockSubscription = {
                endpoint: 'test-endpoint',
                keys: {
                    p256dh: 'test-p256dh',
                    auth: 'test-auth',
                },
            };
            await expect((0, cron_service_1.addUserSubscription)('test-user', mockSubscription)).rejects.toThrow(mockError);
        });
    });
    describe('removeUserSubscription', () => {
        it('should remove a subscription', async () => {
            const mockUserId = 'test-user-id';
            const mockResult = {
                userId: mockUserId,
                subscription: {
                    endpoint: 'test',
                    keys: { p256dh: 'test', auth: 'test' },
                },
            };
            const mockFindOneAndDelete = push_subscription_model_1.default.findOneAndDelete;
            mockFindOneAndDelete.mockResolvedValue(mockResult);
            const result = await (0, cron_service_1.removeUserSubscription)(mockUserId);
            expect(mockFindOneAndDelete).toHaveBeenCalledWith({
                userId: mockUserId,
            });
            expect(result).toEqual(mockResult);
        });
        it('should throw error when removing subscription fails', async () => {
            const mockError = new Error('Database error');
            const mockFindOneAndDelete = push_subscription_model_1.default.findOneAndDelete;
            mockFindOneAndDelete.mockRejectedValue(mockError);
            await expect((0, cron_service_1.removeUserSubscription)('test-user')).rejects.toThrow(mockError);
        });
    });
    describe('startCronJob', () => {
        it('should start the cron job', () => {
            (0, cron_service_1.startCronJob)();
            expect(node_cron_1.default.schedule).toHaveBeenCalledWith('* * * * *', expect.any(Function));
        });
    });
});
