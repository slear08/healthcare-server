import { jest } from '@jest/globals';

import MedicalQueue from '../../../models/medical_queue.model';
import { getActiveQueueByUserIdService } from '../../queue/get_active_queue_by_user_id.service';

jest.mock('../../../models/medical_queue.model');

describe('getActiveQueueByUserIdService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';
  const mockWaitingQueues = [
    { _id: '1', userId: 'other-user', timeSchedule: new Date() },
    { _id: '2', userId, timeSchedule: new Date() },
    { _id: '3', userId: 'another-user', timeSchedule: new Date() },
  ];

  const mockUserQueue = [
    { _id: '2', userId, status: 'waiting', timeSchedule: new Date() },
  ];

  it('should return queue position and details', async () => {
    const mockFind = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(Promise.resolve(mockWaitingQueues)),
      }),
    });

    (MedicalQueue.find as jest.Mock).mockImplementation((criteria: any) => {
      if (criteria?.userId === userId) {
        return Promise.resolve(mockUserQueue);
      }
      return mockFind();
    });

    const result = await getActiveQueueByUserIdService(userId);

    expect(result).toEqual({
      position: 2,
      totalWaiting: 3,
      userQueue: mockUserQueue,
    });
  });

  it('should return null position when user not in queue', async () => {
    const mockFind = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(Promise.resolve(mockWaitingQueues)),
      }),
    });

    (MedicalQueue.find as jest.Mock).mockImplementation((criteria: any) => {
      if (criteria?.userId === 'non-existent-user') {
        return Promise.resolve([]);
      }
      return mockFind();
    });

    const result = await getActiveQueueByUserIdService('non-existent-user');

    expect(result).toEqual({
      position: null,
      totalWaiting: 3,
      userQueue: [],
    });
  });
});
