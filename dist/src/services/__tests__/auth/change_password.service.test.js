"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const globals_1 = require("@jest/globals");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const http_error_1 = require("../../../utils/http-error");
const change_password_service_1 = require("../../auth/change_password.service");
// Mock dependencies
globals_1.jest.mock('../../../models/user.model');
globals_1.jest.mock('bcrypt');
describe('changePasswordService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const mockUserData = {
        _id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        role: 'USER',
        save: globals_1.jest.fn(),
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
        user_model_1.default.findById.mockReturnValue(Promise.resolve(mockUserData));
        // Mock bcrypt.compare result
        bcrypt_1.default.compare.mockReturnValue(Promise.resolve(true));
        // Mock bcrypt.hash result
        const newHashedPassword = 'hashedPassword123';
        bcrypt_1.default.hash.mockReturnValue(Promise.resolve(newHashedPassword));
        const result = await (0, change_password_service_1.changePasswordService)(mockRequest);
        // Assertions
        expect(user_model_1.default.findById).toHaveBeenCalledWith(mockRequest.userId);
        expect(bcrypt_1.default.compare).toHaveBeenCalledWith(mockRequest.currentPassword, mockUserData.password);
        expect(bcrypt_1.default.hash).toHaveBeenCalledWith(mockRequest.newPassword, 10);
        expect(mockUserData.password).toBe(newHashedPassword);
        expect(mockUserData.save).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Password changed successfully' });
    });
    it('should throw HttpError when user is not found', async () => {
        // Mock User.findById result
        user_model_1.default.findById.mockReturnValue(Promise.resolve(null));
        await expect((0, change_password_service_1.changePasswordService)(mockRequest)).rejects.toThrow(http_error_1.HttpError);
        await expect((0, change_password_service_1.changePasswordService)(mockRequest)).rejects.toThrow('User not found');
    });
    it('should throw HttpError when current password is incorrect', async () => {
        // Mock User.findById result
        user_model_1.default.findById.mockReturnValue(Promise.resolve(mockUserData));
        // Mock bcrypt.compare result
        bcrypt_1.default.compare.mockReturnValue(Promise.resolve(false));
        await expect((0, change_password_service_1.changePasswordService)(mockRequest)).rejects.toThrow(http_error_1.HttpError);
        await expect((0, change_password_service_1.changePasswordService)(mockRequest)).rejects.toThrow('Current password is incorrect');
    });
});
