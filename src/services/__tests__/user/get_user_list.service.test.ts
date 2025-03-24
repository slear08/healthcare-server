import { jest } from '@jest/globals';

import USER_TYPE from '../../../constant/user_type.constant';
import User from '../../../models/user.model';
import { getUserListService } from '../../user/get_user_list.service';

// Mock dependencies
jest.mock('../../../models/user.model');

describe('getUserListService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUsers = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: USER_TYPE.USER,
      password: 'hashedPassword1',
    },
    {
      _id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: USER_TYPE.USER,
      password: 'hashedPassword2',
    },
  ];

  it('should return list of users without passwords', async () => {
    // Mock User.find().select() chain
    const mockSelect = jest.fn().mockReturnValue(Promise.resolve(mockUsers));
    const mockFind = jest.fn().mockReturnValue({ select: mockSelect });
    (User.find as jest.Mock) = mockFind;

    const result = await getUserListService();

    // Assertions
    expect(User.find).toHaveBeenCalledWith({ role: USER_TYPE.USER });
    expect(mockSelect).toHaveBeenCalledWith('-password');
    expect(result).toEqual(mockUsers);
  });
});
