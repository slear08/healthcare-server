import { jest } from '@jest/globals';

import USER_TYPE from '../../../constant/user_type.constant';
import User from '../../../models/user.model';
import { getTotalUsersService } from '../../dashboard/get_total_users.service';

// Mock dependencies
jest.mock('../../../models/user.model');

describe('getTotalUsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return total number of users with role USER', async () => {
    // Mock User.countDocuments result
    (User.countDocuments as jest.Mock).mockReturnValue(Promise.resolve(42));

    const result = await getTotalUsersService();

    // Assertions
    expect(User.countDocuments).toHaveBeenCalledWith({ role: USER_TYPE.USER });
    expect(result).toEqual({ totalUsers: 42 });
  });
});
