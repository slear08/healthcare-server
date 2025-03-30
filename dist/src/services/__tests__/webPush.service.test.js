"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_push_1 = __importDefault(require("web-push"));
const globals_1 = require("@jest/globals");
const webPush_service_1 = require("../webPush.service");
// Mock webpush
globals_1.jest.mock('web-push');
describe('WebPush Service', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    describe('sendPushNotification', () => {
        const mockSubscription = {
            endpoint: 'test-endpoint',
            keys: {
                p256dh: 'test-p256dh',
                auth: 'test-auth',
            },
        };
        const mockReminder = {
            _id: 'test-reminder-id',
            name: 'Test Medicine',
            numberToTake: 1,
            isEveryday: true,
            time: '10:00',
            userId: 'test-user-id',
        };
        it('should successfully send a push notification', async () => {
            const mockSendNotification = web_push_1.default.sendNotification;
            const mockResult = {
                statusCode: 201,
                body: '',
                headers: {},
            };
            mockSendNotification.mockResolvedValue(mockResult);
            const result = await (0, webPush_service_1.sendPushNotification)(mockSubscription, mockReminder);
            expect(mockSendNotification).toHaveBeenCalledWith(mockSubscription, expect.stringContaining('Test Medicine'));
            expect(result).toBe(true);
        });
        it('should return false when sending notification fails', async () => {
            const mockError = new Error('Push notification failed');
            const mockSendNotification = web_push_1.default.sendNotification;
            mockSendNotification.mockRejectedValue(mockError);
            const result = await (0, webPush_service_1.sendPushNotification)(mockSubscription, mockReminder);
            expect(result).toBe(false);
        });
        it('should include correct payload in notification', async () => {
            const mockSendNotification = web_push_1.default.sendNotification;
            const mockResult = {
                statusCode: 201,
                body: '',
                headers: {},
            };
            mockSendNotification.mockResolvedValue(mockResult);
            await (0, webPush_service_1.sendPushNotification)(mockSubscription, mockReminder);
            const expectedPayload = JSON.stringify({
                title: 'Medicine Reminder',
                body: `Time to take ${mockReminder.numberToTake} ${mockReminder.name}`,
                icon: '/icon.png',
                badge: '/badge.png',
                data: {
                    reminderId: mockReminder._id,
                },
            });
            expect(mockSendNotification).toHaveBeenCalledWith(mockSubscription, expectedPayload);
        });
    });
});
