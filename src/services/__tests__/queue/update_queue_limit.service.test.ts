import { jest } from '@jest/globals';

import MedicalQueue from '../../../models/medical_queue.model';
import MedicalQueueLimit from '../../../models/queue_limit.model';
import { HttpError } from '../../../utils/http-error';
import { updateQueueLimitService } from '../../queue/update_queue_limit.service';

jest.mock('../../../models/medical_queue.model');
jest.mock('../../../models/queue_limit.model');

describe('updateQueueLimitService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUpdatedLimit = {
    status: 'ON' as const,
    limit: 50,
  };

  it('should update queue limit successfully', async () => {
    (MedicalQueue.countDocuments as jest.Mock).mockReturnValue(
      Promise.resolve(10)
    );
    (MedicalQueueLimit.findOneAndUpdate as jest.Mock).mockReturnValue(
      Promise.resolve(mockUpdatedLimit)
    );

    const result = await updateQueueLimitService('ON', 50);

    expect(MedicalQueue.countDocuments).toHaveBeenCalledWith({
      status: { $in: ['waiting', 'in-progress'] },
      deletedAt: null,
    });
    expect(MedicalQueueLimit.findOneAndUpdate).toHaveBeenCalledWith(
      {},
      { $set: { status: 'ON', limit: 50 } },
      { new: true, runValidators: true }
    );
    expect(result).toEqual(mockUpdatedLimit);
  });

  it('should throw error when limit is less than 1', async () => {
    await expect(updateQueueLimitService('ON', 0)).rejects.toThrow(
      new HttpError(400, 'Queue limit must be at least 1')
    );
  });

  it('should throw error when limit is less than active queues', async () => {
    (MedicalQueue.countDocuments as jest.Mock).mockReturnValue(
      Promise.resolve(20)
    );

    await expect(updateQueueLimitService('ON', 10)).rejects.toThrow(
      new HttpError(
        400,
        'Cannot set limit below current active queue count (20 active queues)'
      )
    );
  });
});
