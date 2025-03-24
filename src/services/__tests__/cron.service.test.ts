import cron from 'node-cron';
import { PushSubscription } from 'web-push';

import { jest } from '@jest/globals';

import PushSubscriptionModel from '../../models/push_subscription.model';
import {
  addUserSubscription,
  removeUserSubscription,
  startCronJob,
} from '../cron.service';

// Mock dependencies
jest.mock('node-cron');
jest.mock('../../models/push_subscription.model');
jest.mock('../webPush.service', () => ({
  sendPushNotification: jest.fn().mockImplementation(async () => true),
}));

type MockPushSubscription = {
  userId: string;
  subscription: PushSubscription;
};

describe('Cron Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addUserSubscription', () => {
    it('should add a new subscription', async () => {
      const mockUserId = 'test-user-id';
      const mockSubscription: PushSubscription = {
        endpoint: 'test-endpoint',
        keys: {
          p256dh: 'test-p256dh',
          auth: 'test-auth',
        },
      };
      const mockResult: MockPushSubscription = {
        userId: mockUserId,
        subscription: mockSubscription,
      };

      const mockFindOneAndUpdate =
        PushSubscriptionModel.findOneAndUpdate as jest.MockedFunction<
          typeof PushSubscriptionModel.findOneAndUpdate
        >;
      mockFindOneAndUpdate.mockResolvedValue(mockResult);

      const result = await addUserSubscription(mockUserId, mockSubscription);

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { userId: mockUserId },
        { subscription: mockSubscription },
        { upsert: true, new: true }
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw error when adding subscription fails', async () => {
      const mockError = new Error('Database error');
      const mockFindOneAndUpdate =
        PushSubscriptionModel.findOneAndUpdate as jest.MockedFunction<
          typeof PushSubscriptionModel.findOneAndUpdate
        >;
      mockFindOneAndUpdate.mockRejectedValue(mockError);

      const mockSubscription: PushSubscription = {
        endpoint: 'test-endpoint',
        keys: {
          p256dh: 'test-p256dh',
          auth: 'test-auth',
        },
      };

      await expect(
        addUserSubscription('test-user', mockSubscription)
      ).rejects.toThrow(mockError);
    });
  });

  describe('removeUserSubscription', () => {
    it('should remove a subscription', async () => {
      const mockUserId = 'test-user-id';
      const mockResult: MockPushSubscription = {
        userId: mockUserId,
        subscription: {
          endpoint: 'test',
          keys: { p256dh: 'test', auth: 'test' },
        },
      };

      const mockFindOneAndDelete =
        PushSubscriptionModel.findOneAndDelete as jest.MockedFunction<
          typeof PushSubscriptionModel.findOneAndDelete
        >;
      mockFindOneAndDelete.mockResolvedValue(mockResult);

      const result = await removeUserSubscription(mockUserId);

      expect(mockFindOneAndDelete).toHaveBeenCalledWith({
        userId: mockUserId,
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw error when removing subscription fails', async () => {
      const mockError = new Error('Database error');
      const mockFindOneAndDelete =
        PushSubscriptionModel.findOneAndDelete as jest.MockedFunction<
          typeof PushSubscriptionModel.findOneAndDelete
        >;
      mockFindOneAndDelete.mockRejectedValue(mockError);

      await expect(removeUserSubscription('test-user')).rejects.toThrow(
        mockError
      );
    });
  });

  describe('startCronJob', () => {
    it('should start the cron job', () => {
      startCronJob();
      expect(cron.schedule).toHaveBeenCalledWith(
        '* * * * *',
        expect.any(Function)
      );
    });
  });
});
