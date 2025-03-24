import { jest } from '@jest/globals';

import MedicalQueue from '../../../models/medical_queue.model';
import { HttpError } from '../../../utils/http-error';
import { updateUserQueueStatusService } from '../../queue/update_user_queue_status.service';

jest.mock('../../../models/medical_queue.model');

describe('updateUserQueueStatusService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';
  const queueId = 'test-queue-id';
  const status = 'completed' as const;
  const mockIo = {
    emit: jest.fn(),
  };

  const mockUpdatedQueue = {
    _id: queueId,
    userId,
    status,
    purpose: 'checkup',
    timeSchedule: new Date(),
  };

  it('should update queue status and emit socket event', async () => {
    (MedicalQueue.findOneAndUpdate as jest.Mock).mockReturnValue(
      Promise.resolve(mockUpdatedQueue)
    );

    const result = await updateUserQueueStatusService(
      userId,
      queueId,
      status,
      mockIo
    );

    expect(MedicalQueue.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: queueId, userId },
      { status },
      { new: true, runValidators: true }
    );
    expect(mockIo.emit).toHaveBeenCalledWith('queueStatusUpdate', {
      queueId,
      userId,
      status,
      updatedQueue: mockUpdatedQueue,
    });
    expect(result).toEqual(mockUpdatedQueue);
  });

  it('should throw error when queue not found', async () => {
    (MedicalQueue.findOneAndUpdate as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );

    await expect(
      updateUserQueueStatusService(userId, queueId, status, mockIo)
    ).rejects.toThrow(new HttpError(404, 'Queue not found or unauthorized'));
  });

  it('should handle socket emission error gracefully', async () => {
    (MedicalQueue.findOneAndUpdate as jest.Mock).mockReturnValue(
      Promise.resolve(mockUpdatedQueue)
    );

    const mockIoWithError = {
      emit: jest.fn().mockImplementation(() => {
        throw new Error('Socket error');
      }),
    };

    const result = await updateUserQueueStatusService(
      userId,
      queueId,
      status,
      mockIoWithError
    );

    expect(result).toEqual(mockUpdatedQueue);
  });
});
