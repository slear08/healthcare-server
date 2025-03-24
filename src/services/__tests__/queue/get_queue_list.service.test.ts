import { jest } from '@jest/globals';

import MedicalQueue from '../../../models/medical_queue.model';
import { getQueueListService } from '../../queue/get_queue_list.service';

jest.mock('../../../models/medical_queue.model');

describe('getQueueListService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockQueueList = [
    {
      _id: '1',
      userId: {
        _id: 'user1',
        name: 'Test User 1',
        email: 'test1@example.com',
        profile: 'profile1',
      },
      status: 'waiting',
      purpose: 'checkup',
      timeSchedule: new Date(),
      toObject: jest.fn().mockReturnThis(),
    },
    {
      _id: '2',
      userId: {
        _id: 'user2',
        name: 'Test User 2',
        email: 'test2@example.com',
        profile: 'profile2',
      },
      status: 'completed',
      purpose: 'medicine-request',
      timeSchedule: new Date(),
      toObject: jest.fn().mockReturnThis(),
    },
  ];

  const mockQuery = {
    getQuery: jest.fn().mockReturnValue({}),
    or: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockReturnValue(Promise.resolve(mockQueueList)),
  };

  beforeEach(() => {
    (MedicalQueue.find as jest.Mock).mockReturnValue(mockQuery);
    (MedicalQueue.countDocuments as jest.Mock).mockReturnValue(
      Promise.resolve(2)
    );
  });

  it('should return paginated queue list with default parameters', async () => {
    const result = await getQueueListService({});

    expect(MedicalQueue.find).toHaveBeenCalledWith({ deletedAt: null });
    expect(result).toEqual({
      queueList: mockQueueList.map(({ userId, ...queue }) => ({
        ...queue,
        user: userId,
      })),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('should apply search filter', async () => {
    const search = 'test';
    const mockUsers = [{ _id: 'user1' }, { _id: 'user2' }];

    const mockUserModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(Promise.resolve(mockUsers)),
      }),
    };

    (MedicalQueue.db.model as jest.Mock).mockReturnValue(mockUserModel);

    await getQueueListService({ search });

    expect(MedicalQueue.db.model).toHaveBeenCalledWith('User');
    expect(mockQuery.or).toHaveBeenCalledWith([
      { _id: { $regex: search, $options: 'i' } },
      { userId: { $in: ['user1', 'user2'] } },
    ]);
  });

  it('should apply status and purpose filters', async () => {
    await getQueueListService({
      status: 'waiting',
      purpose: 'checkup',
    });

    expect(mockQuery.where).toHaveBeenCalledWith('purpose', 'checkup');
    expect(mockQuery.where).toHaveBeenCalledWith('status', 'waiting');
  });

  it('should apply sorting', async () => {
    await getQueueListService({
      sort: 'timeSchedule:desc',
    });

    expect(mockQuery.sort).toHaveBeenCalledWith({ timeSchedule: -1 });
  });

  it('should handle pagination', async () => {
    await getQueueListService({
      page: 2,
      limit: 5,
    });

    expect(mockQuery.skip).toHaveBeenCalledWith(5);
    expect(mockQuery.limit).toHaveBeenCalledWith(5);
  });

  it('should populate user information', async () => {
    await getQueueListService({});

    expect(mockQuery.populate).toHaveBeenCalledWith({
      path: 'userId',
      select: 'name email profile',
      model: 'User',
    });
  });
});
