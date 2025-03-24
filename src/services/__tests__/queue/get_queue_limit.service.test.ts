import { jest } from '@jest/globals';

import MedicalQueueLimit from '../../../models/queue_limit.model';
import { getQueueLimitService } from '../../queue/get_queue_limit.service';

jest.mock('../../../models/queue_limit.model');

describe('getQueueLimitService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockQueueLimit = {
    status: 'ON',
    limit: 30,
  };

  it('should return existing queue limit', async () => {
    (MedicalQueueLimit.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(mockQueueLimit)
    );

    const result = await getQueueLimitService();

    expect(MedicalQueueLimit.findOne).toHaveBeenCalled();
    expect(result).toEqual(mockQueueLimit);
  });

  it('should create default queue limit when none exists', async () => {
    const mockSave = jest.fn().mockReturnValue(Promise.resolve(mockQueueLimit));
    const mockInstance = {
      ...mockQueueLimit,
      save: mockSave,
    };
    const mockConstructor = jest.fn().mockReturnValue(mockInstance);

    (MedicalQueueLimit.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );
    (MedicalQueueLimit as unknown as jest.Mock).mockImplementation(
      mockConstructor
    );

    const result = await getQueueLimitService();

    expect(MedicalQueueLimit.findOne).toHaveBeenCalled();
    expect(mockConstructor).toHaveBeenCalledWith({
      status: 'ON',
      limit: 30,
    });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(mockInstance);
  });
});
