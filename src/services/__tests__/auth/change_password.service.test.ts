import bcrypt from 'bcrypt';

import { jest } from '@jest/globals';

import User from '../../../models/user.model';
import { HttpError } from '../../../utils/http-error';
import { changePasswordService } from '../../auth/change_password.service';

// Mock dependencies
jest.mock('../../../models/user.model');
jest.mock('bcrypt');

describe('changePasswordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  interface MockUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    save: jest.Mock;
  }

  const mockUserData: MockUser = {
    _id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'USER',
    save: jest.fn(),
  };

  // Set up save mock after mockUserData is defined
  mockUserData.save.mockReturnValue(Promise.resolve(mockUserData));

  const mockRequest = {
    userId: 'test-user-id',
    currentPassword: 'currentPassword123',
    newPassword: 'newHashedPassword123',
  };

  it('should successfully change password with valid credentials', async () => {
    // Mock User.findById result
    (User.findById as jest.Mock).mockReturnValue(Promise.resolve(mockUserData));

    // Mock bcrypt.compare result
    (bcrypt.compare as jest.Mock).mockReturnValue(Promise.resolve(true));

    // Mock bcrypt.hash result
    const newHashedPassword = 'hashedPassword123';
    (bcrypt.hash as jest.Mock).mockReturnValue(
      Promise.resolve(newHashedPassword)
    );

    const result = await changePasswordService(mockRequest);

    // Assertions
    expect(User.findById).toHaveBeenCalledWith(mockRequest.userId);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockRequest.currentPassword,
      mockUserData.password
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(mockRequest.newPassword, 10);
    expect(mockUserData.password).toBe(newHashedPassword);
    expect(mockUserData.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Password changed successfully' });
  });

  it('should throw HttpError when user is not found', async () => {
    // Mock User.findById result
    (User.findById as jest.Mock).mockReturnValue(Promise.resolve(null));

    await expect(changePasswordService(mockRequest)).rejects.toThrow(HttpError);
    await expect(changePasswordService(mockRequest)).rejects.toThrow(
      'User not found'
    );
  });

  it('should throw HttpError when current password is incorrect', async () => {
    // Mock User.findById result
    (User.findById as jest.Mock).mockReturnValue(Promise.resolve(mockUserData));

    // Mock bcrypt.compare result
    (bcrypt.compare as jest.Mock).mockReturnValue(Promise.resolve(false));

    await expect(changePasswordService(mockRequest)).rejects.toThrow(HttpError);
    await expect(changePasswordService(mockRequest)).rejects.toThrow(
      'Current password is incorrect'
    );
  });
});
