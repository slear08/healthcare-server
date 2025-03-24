import bcrypt from 'bcrypt';

import { jest } from '@jest/globals';

import User from '../../../models/user.model';
import { HttpError } from '../../../utils/http-error';
import { SignRefreshToken } from '../../../utils/jwt/sign_refresh_token.util';
import { SignJWT } from '../../../utils/jwt/sign_token.util';
import log from '../../../utils/logger';
import { loginUserService } from '../../auth/login.service';

// Mock dependencies
jest.mock('../../../models/user.model');
jest.mock('bcrypt');
jest.mock('../../../utils/jwt/sign_token.util');
jest.mock('../../../utils/jwt/sign_refresh_token.util');

describe('loginUserService', () => {
  beforeEach(() => {
    jest.restoreAllMocks(); // 💡 This ensures all mocks are fully reset
  });

  const mockUserData = {
    _id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'USER',
  };

  const mockTokens = {
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
  };

  it('should successfully login a user with valid credentials', async () => {
    // Mock User.findOne result
    (User.findOne as jest.Mock).mockReturnValue(Promise.resolve(mockUserData));

    // Mock bcrypt.compare result
    (bcrypt.compare as jest.Mock).mockReturnValue(Promise.resolve(true));

    // Mock JWT functions results
    (SignJWT as jest.Mock).mockReturnValue(mockTokens.token);
    (SignRefreshToken as jest.Mock).mockReturnValue(mockTokens.refreshToken);

    const result = await loginUserService('test@example.com', 'password123');

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      mockUserData.password
    );
    expect(SignJWT).toHaveBeenCalledWith({
      id: mockUserData._id,
      name: mockUserData.name,
      email: mockUserData.email,
      role: mockUserData.role,
    });
    expect(SignRefreshToken).toHaveBeenCalledWith({
      id: mockUserData._id,
      name: mockUserData.name,
      email: mockUserData.email,
      role: mockUserData.role,
    });
    expect(result).toEqual({
      message: 'Logged in successfully',
      user: { name: mockUserData.name, role: mockUserData.role },
      auth: { token: mockTokens.token, refreshToken: mockTokens.refreshToken },
    });
  });

  it('should throw HttpError when user does not exist', async () => {
    // Mock User.findOne result
    (User.findOne as jest.Mock).mockReturnValue(Promise.resolve(null));

    await expect(
      loginUserService('nonexistent@example.com', 'password123')
    ).rejects.toThrow(HttpError);
    await expect(
      loginUserService('nonexistent@example.com', 'password123')
    ).rejects.toThrow('Account does not exist');
  });

  it('should throw HttpError when password is incorrect', async () => {
    // Mock User.findOne result
    (User.findOne as jest.Mock).mockReturnValue(mockUserData);

    // Mock bcrypt.compare result
    (bcrypt.compare as jest.Mock).mockReturnValue(false);

    try {
      const result = await loginUserService(
        'test@example.com',
        'wrongpassword'
      );
      log.info('Unexpected success:', result); // This should never run
    } catch (error) {
      log.info('Caught error:', error); // This should log the error
    }

    await expect(
      loginUserService('test@example.com', 'wrongpassword')
    ).rejects.toThrow(HttpError);
    await expect(
      loginUserService('test@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid email or password');
  });
});
