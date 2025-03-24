import { jest } from '@jest/globals';

import MedicalQueue from '../../../models/medical_queue.model';
import { getQueueHistoryByUserService } from '../../queue/get_queue_history_by_user_id.service';

jest.mock('../../../models/medical_queue.model');

describe('getQueueHistoryByUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';
  const mockQueueHistory = [
    {
      _id: '1',
      userId,
      status: 'completed',
      purpose: 'checkup',
      timeSchedule: new Date(),
    },
    {
      _id: '2',
      userId,
      status: 'cancelled',
      purpose: 'medicine-request',
      timeSchedule: new Date(),
    },
  ];

  it('should return queue history for user', async () => {
    (MedicalQueue.find as jest.Mock).mockReturnValue(
      Promise.resolve(mockQueueHistory)
    );

    const result = await getQueueHistoryByUserService(userId);

    expect(MedicalQueue.find).toHaveBeenCalledWith({ userId });
    expect(result).toEqual(mockQueueHistory);
  });
});
