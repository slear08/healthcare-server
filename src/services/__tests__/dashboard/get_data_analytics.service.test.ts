import { jest } from '@jest/globals';

import MedicalQueue from '../../../models/medical_queue.model';
import MedicalQueueLimit from '../../../models/queue_limit.model';
import User from '../../../models/user.model';
import { getDataAnalyticsService } from '../../dashboard/get_data_analytics.service';

// Mock dependencies
jest.mock('../../../models/user.model');
jest.mock('../../../models/medical_queue.model');
jest.mock('../../../models/queue_limit.model');

describe('getDataAnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current date to be consistent in tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-24'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockWeeklyUsersData = [
    { _id: '2024-03-18', count: 5 },
    { _id: '2024-03-19', count: 3 },
    { _id: '2024-03-20', count: 7 },
    { _id: '2024-03-21', count: 4 },
    { _id: '2024-03-22', count: 6 },
    { _id: '2024-03-23', count: 2 },
    { _id: '2024-03-24', count: 1 },
  ];

  const mockWeeklyQueuesData = [
    { _id: '2024-03-18', count: 10 },
    { _id: '2024-03-19', count: 8 },
    { _id: '2024-03-20', count: 12 },
    { _id: '2024-03-21', count: 9 },
    { _id: '2024-03-22', count: 11 },
    { _id: '2024-03-23', count: 7 },
    { _id: '2024-03-24', count: 5 },
  ];

  const mockQueueLimitData = {
    status: 'ON',
    limit: 50,
    createdAt: new Date(),
  };

  it('should return complete analytics data', async () => {
    // Mock User.countDocuments result
    (User.countDocuments as jest.Mock).mockReturnValue(Promise.resolve(100));

    // Mock User.aggregate result
    (User.aggregate as jest.Mock).mockReturnValue(
      Promise.resolve(mockWeeklyUsersData)
    );

    // Mock MedicalQueue.aggregate result
    (MedicalQueue.aggregate as jest.Mock).mockReturnValue(
      Promise.resolve(mockWeeklyQueuesData)
    );

    // Mock MedicalQueue.countDocuments result
    (MedicalQueue.countDocuments as jest.Mock).mockReturnValue(
      Promise.resolve(15)
    );

    // Mock MedicalQueueLimit.findOne result
    (MedicalQueueLimit.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(mockQueueLimitData)
    );

    const result = await getDataAnalyticsService();

    // Assertions
    expect(User.countDocuments).toHaveBeenCalled();
    expect(User.aggregate).toHaveBeenCalled();
    expect(MedicalQueue.aggregate).toHaveBeenCalled();
    expect(MedicalQueue.countDocuments).toHaveBeenCalledWith({
      status: 'waiting',
      createdAt: expect.any(Object),
    });
    expect(MedicalQueueLimit.findOne).toHaveBeenCalledWith(
      {},
      { sort: { createdAt: -1 } }
    );

    // Verify the structure of the response
    expect(result).toEqual({
      totalUsers: 100,
      weeklyTrend: {
        newUsers: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            value: expect.any(Number),
          }),
        ]),
        totalQueues: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            value: expect.any(Number),
          }),
        ]),
      },
      totalWaitingToday: 15,
      queueLimit: {
        status: 'ON',
        limit: 50,
      },
    });
  });

  it('should handle case when no queue limit data exists', async () => {
    // Mock User.countDocuments result
    (User.countDocuments as jest.Mock).mockReturnValue(Promise.resolve(100));

    // Mock User.aggregate result
    (User.aggregate as jest.Mock).mockReturnValue(
      Promise.resolve(mockWeeklyUsersData)
    );

    // Mock MedicalQueue.aggregate result
    (MedicalQueue.aggregate as jest.Mock).mockReturnValue(
      Promise.resolve(mockWeeklyQueuesData)
    );

    // Mock MedicalQueue.countDocuments result
    (MedicalQueue.countDocuments as jest.Mock).mockReturnValue(
      Promise.resolve(15)
    );

    // Mock MedicalQueueLimit.findOne result to return null
    (MedicalQueueLimit.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );

    const result = await getDataAnalyticsService();

    // Verify the queueLimit has default values
    expect(result.queueLimit).toEqual({
      status: 'OFF',
      limit: 0,
    });
  });
});
