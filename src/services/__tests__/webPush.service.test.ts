import webpush, { PushSubscription, SendResult } from 'web-push';

import { jest } from '@jest/globals';

import { IMedicineReminder } from '../../models/medicine_reminder.model';
import { sendPushNotification } from '../webPush.service';

// Mock webpush
jest.mock('web-push');

describe('WebPush Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendPushNotification', () => {
    const mockSubscription: PushSubscription = {
      endpoint: 'test-endpoint',
      keys: {
        p256dh: 'test-p256dh',
        auth: 'test-auth',
      },
    };

    const mockReminder: Partial<IMedicineReminder> = {
      _id: 'test-reminder-id',
      name: 'Test Medicine',
      numberToTake: 1,
      isEveryday: true,
      time: '10:00',
      userId: 'test-user-id',
    };

    it('should successfully send a push notification', async () => {
      const mockSendNotification =
        webpush.sendNotification as jest.MockedFunction<
          typeof webpush.sendNotification
        >;
      const mockResult: SendResult = {
        statusCode: 201,
        body: '',
        headers: {},
      };
      mockSendNotification.mockResolvedValue(mockResult);

      const result = await sendPushNotification(
        mockSubscription,
        mockReminder as IMedicineReminder
      );

      expect(mockSendNotification).toHaveBeenCalledWith(
        mockSubscription,
        expect.stringContaining('Test Medicine')
      );
      expect(result).toBe(true);
    });

    it('should return false when sending notification fails', async () => {
      const mockError = new Error('Push notification failed');
      const mockSendNotification =
        webpush.sendNotification as jest.MockedFunction<
          typeof webpush.sendNotification
        >;
      mockSendNotification.mockRejectedValue(mockError);

      const result = await sendPushNotification(
        mockSubscription,
        mockReminder as IMedicineReminder
      );

      expect(result).toBe(false);
    });

    it('should include correct payload in notification', async () => {
      const mockSendNotification =
        webpush.sendNotification as jest.MockedFunction<
          typeof webpush.sendNotification
        >;
      const mockResult: SendResult = {
        statusCode: 201,
        body: '',
        headers: {},
      };
      mockSendNotification.mockResolvedValue(mockResult);

      await sendPushNotification(
        mockSubscription,
        mockReminder as IMedicineReminder
      );

      const expectedPayload = JSON.stringify({
        title: 'Medicine Reminder',
        body: `Time to take ${mockReminder.numberToTake} ${mockReminder.name}`,
        icon: '/icon.png',
        badge: '/badge.png',
        data: {
          reminderId: mockReminder._id,
        },
      });

      expect(mockSendNotification).toHaveBeenCalledWith(
        mockSubscription,
        expectedPayload
      );
    });
  });
});
