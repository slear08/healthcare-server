"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const globals_1 = require("@jest/globals");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const http_error_1 = require("../../../utils/http-error");
const sign_refresh_token_util_1 = require("../../../utils/jwt/sign_refresh_token.util");
const sign_token_util_1 = require("../../../utils/jwt/sign_token.util");
const logger_1 = __importDefault(require("../../../utils/logger"));
const login_service_1 = require("../../auth/login.service");
// Mock dependencies
globals_1.jest.mock('../../../models/user.model');
globals_1.jest.mock('bcrypt');
globals_1.jest.mock('../../../utils/jwt/sign_token.util');
globals_1.jest.mock('../../../utils/jwt/sign_refresh_token.util');
describe('loginUserService', () => {
    beforeEach(() => {
        globals_1.jest.restoreAllMocks(); // 💡 This ensures all mocks are fully reset
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
        user_model_1.default.findOne.mockReturnValue(Promise.resolve(mockUserData));
        // Mock bcrypt.compare result
        bcrypt_1.default.compare.mockReturnValue(Promise.resolve(true));
        // Mock JWT functions results
        sign_token_util_1.SignJWT.mockReturnValue(mockTokens.token);
        sign_refresh_token_util_1.SignRefreshToken.mockReturnValue(mockTokens.refreshToken);
        const result = await (0, login_service_1.loginUserService)('test@example.com', 'password123');
        // Assertions
        expect(user_model_1.default.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt_1.default.compare).toHaveBeenCalledWith('password123', mockUserData.password);
        expect(sign_token_util_1.SignJWT).toHaveBeenCalledWith({
            id: mockUserData._id,
            name: mockUserData.name,
            email: mockUserData.email,
            role: mockUserData.role,
        });
        expect(sign_refresh_token_util_1.SignRefreshToken).toHaveBeenCalledWith({
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
        user_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        await expect((0, login_service_1.loginUserService)('nonexistent@example.com', 'password123')).rejects.toThrow(http_error_1.HttpError);
        await expect((0, login_service_1.loginUserService)('nonexistent@example.com', 'password123')).rejects.toThrow('Account does not exist');
    });
    it('should throw HttpError when password is incorrect', async () => {
        // Mock User.findOne result
        user_model_1.default.findOne.mockReturnValue(mockUserData);
        // Mock bcrypt.compare result
        bcrypt_1.default.compare.mockReturnValue(false);
        try {
            const result = await (0, login_service_1.loginUserService)('test@example.com', 'wrongpassword');
            logger_1.default.info('Unexpected success:', result); // This should never run
        }
        catch (error) {
            logger_1.default.info('Caught error:', error); // This should log the error
        }
        await expect((0, login_service_1.loginUserService)('test@example.com', 'wrongpassword')).rejects.toThrow(http_error_1.HttpError);
        await expect((0, login_service_1.loginUserService)('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid email or password');
    });
});
