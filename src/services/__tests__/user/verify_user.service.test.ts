import { jest } from '@jest/globals';

import User from '../../../models/user.model';
import { HttpError } from '../../../utils/http-error';
import { verifyUserService } from '../../user/verify_user.service';

// Mock dependencies
jest.mock('../../../models/user.model');

describe('verifyUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    mobileNumber: '',
    isVerified: false,
    save: jest.fn(),
  };

  const verifyRequest = {
    userId: '1',
    name: 'John Doe',
    mobileNumber: '1234567890',
  };

  it('should verify user and update their information', async () => {
    // Mock User.findById
    (User.findById as jest.Mock).mockReturnValue(Promise.resolve(mockUser));
    mockUser.save.mockReturnValue(Promise.resolve(mockUser));

    const result = await verifyUserService(verifyRequest);

    // Assertions
    expect(User.findById).toHaveBeenCalledWith(verifyRequest.userId);
    expect(mockUser.name).toBe(verifyRequest.name);
    expect(mockUser.mobileNumber).toBe(verifyRequest.mobileNumber);
    expect(mockUser.isVerified).toBe(true);
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Setup completed successfully',
      user: {
        name: verifyRequest.name,
        email: mockUser.email,
        mobileNumber: verifyRequest.mobileNumber,
        isVerified: true,
      },
    });
  });

  it('should throw error when user is not found', async () => {
    // Mock User.findById to return null
    (User.findById as jest.Mock).mockReturnValue(Promise.resolve(null));

    await expect(verifyUserService(verifyRequest)).rejects.toThrow(HttpError);
    await expect(verifyUserService(verifyRequest)).rejects.toMatchObject({
      statusCode: 404,
      message: 'User not found',
    });
  });
});
