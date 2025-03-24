import bcrypt from 'bcrypt';

import User from '../../../models/user.model';
import { HttpError } from '../../../utils/http-error';
import { registerUserService } from '../../auth/regiter.service';

// Mock the User model
jest.mock('../../../models/user.model');

// Mock bcrypt
jest.mock('bcrypt');

describe('registerUserService', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  it('should successfully register a new user', async () => {
    // Mock User.findOne to return null (no existing user)
    (User.findOne as jest.Mock).mockResolvedValue(null);

    // Mock bcrypt.hash to return a hashed password
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

    // Mock User.save to return the saved user
    const mockSave = jest
      .fn()
      .mockResolvedValue({ ...mockUserData, password: 'hashedPassword123' });
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave,
    }));

    const result = await registerUserService(mockUserData);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual({ message: 'User registered successfully' });
  });

  it('should throw HttpError when email already exists', async () => {
    // Mock User.findOne to return an existing user
    (User.findOne as jest.Mock).mockResolvedValue({
      email: mockUserData.email,
    });

    // Assert that the service throws an HttpError
    await expect(registerUserService(mockUserData)).rejects.toThrow(HttpError);
    await expect(registerUserService(mockUserData)).rejects.toThrow(
      'Email already exists'
    );
  });
});
