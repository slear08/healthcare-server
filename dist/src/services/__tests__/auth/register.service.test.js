"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const http_error_1 = require("../../../utils/http-error");
const regiter_service_1 = require("../../auth/regiter.service");
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
        user_model_1.default.findOne.mockResolvedValue(null);
        // Mock bcrypt.hash to return a hashed password
        bcrypt_1.default.hash.mockResolvedValue('hashedPassword123');
        // Mock User.save to return the saved user
        const mockSave = jest
            .fn()
            .mockResolvedValue({ ...mockUserData, password: 'hashedPassword123' });
        user_model_1.default.mockImplementation(() => ({
            save: mockSave,
        }));
        const result = await (0, regiter_service_1.registerUserService)(mockUserData);
        // Assertions
        expect(user_model_1.default.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
        expect(bcrypt_1.default.hash).toHaveBeenCalledWith(mockUserData.password, 10);
        expect(mockSave).toHaveBeenCalled();
        expect(result).toEqual({ message: 'User registered successfully' });
    });
    it('should throw HttpError when email already exists', async () => {
        // Mock User.findOne to return an existing user
        user_model_1.default.findOne.mockResolvedValue({
            email: mockUserData.email,
        });
        // Assert that the service throws an HttpError
        await expect((0, regiter_service_1.registerUserService)(mockUserData)).rejects.toThrow(http_error_1.HttpError);
        await expect((0, regiter_service_1.registerUserService)(mockUserData)).rejects.toThrow('Email already exists');
    });
});
