import { jest } from '@jest/globals';

import MedicalQueue from '../../../models/medical_queue.model';
import { HttpError } from '../../../utils/http-error';
import { queueValidatorUtil } from '../../../utils/queue_validator/queue_validator.util';
import { createQueueService } from '../../queue/create_queue.service';

jest.mock('../../../models/medical_queue.model');
jest.mock('../../../utils/queue_validator/queue_validator.util');

describe('createQueueService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';
  const purpose = 'checkup' as const;
  const mockIo = {
    emit: jest.fn(),
  };

  const mockQueueEntry = {
    _id: 'test-queue-id',
    userId,
    status: 'waiting',
    purpose,
    timeSchedule: new Date(),
  };

  it('should create new queue entry successfully', async () => {
    (MedicalQueue.findOne as jest.Mock).mockReturnValue(Promise.resolve(null));
    (queueValidatorUtil as jest.Mock).mockReturnValue(Promise.resolve(true));

    // Create a mock instance with save method
    const mockInstance = {
      ...mockQueueEntry,
      save: jest.fn().mockReturnValue(Promise.resolve(mockQueueEntry)),
    };

    // Mock the constructor to return our mock instance
    (MedicalQueue as unknown as jest.Mock).mockImplementation(
      () => mockInstance
    );

    const result = await createQueueService(userId, purpose, mockIo);

    expect(MedicalQueue.findOne).toHaveBeenCalledWith({
      userId,
      status: 'waiting',
    });
    expect(queueValidatorUtil).toHaveBeenCalled();
    expect(mockIo.emit).toHaveBeenCalledWith('newQueueEntry', {
      queueId: mockQueueEntry._id,
      userId,
      purpose,
      timeSchedule: mockQueueEntry.timeSchedule,
      status: mockQueueEntry.status,
    });
    expect(result).toEqual({
      message: 'Queue created successfully',
      queue: {
        ...mockQueueEntry,
        save: expect.any(Function),
      },
    });
  });

  it('should return message when queue already exists', async () => {
    (MedicalQueue.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(mockQueueEntry)
    );

    const result = await createQueueService(userId, purpose, mockIo);

    expect(result).toBe('Queue entry already exists for this user');
  });

  it('should throw error when queue limit is reached', async () => {
    (MedicalQueue.findOne as jest.Mock).mockReturnValue(Promise.resolve(null));
    (queueValidatorUtil as jest.Mock).mockReturnValue(Promise.resolve(false));

    await expect(createQueueService(userId, purpose, mockIo)).rejects.toThrow(
      new HttpError(400, 'Queue limit reached')
    );
  });

  it('should handle socket emission error gracefully', async () => {
    (MedicalQueue.findOne as jest.Mock).mockReturnValue(Promise.resolve(null));
    (queueValidatorUtil as jest.Mock).mockReturnValue(Promise.resolve(true));

    // Create a mock instance with save method
    const mockInstance = {
      ...mockQueueEntry,
      save: jest.fn().mockReturnValue(Promise.resolve(mockQueueEntry)),
    };

    // Mock the constructor to return our mock instance
    (MedicalQueue as unknown as jest.Mock).mockImplementation(
      () => mockInstance
    );

    const mockIoWithError = {
      emit: jest.fn().mockImplementation(() => {
        throw new Error('Socket error');
      }),
    };

    const result = await createQueueService(userId, purpose, mockIoWithError);

    expect(result).toEqual({
      message: 'Queue created successfully',
      queue: {
        ...mockQueueEntry,
        save: expect.any(Function),
      },
    });
  });
});
