"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const http_error_1 = require("../../../utils/http-error");
const verify_user_service_1 = require("../../user/verify_user.service");
// Mock dependencies
globals_1.jest.mock('../../../models/user.model');
describe('verifyUserService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const mockUser = {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        mobileNumber: '',
        isVerified: false,
        save: globals_1.jest.fn(),
    };
    const verifyRequest = {
        userId: '1',
        name: 'John Doe',
        mobileNumber: '1234567890',
    };
    it('should verify user and update their information', async () => {
        // Mock User.findById
        user_model_1.default.findById.mockReturnValue(Promise.resolve(mockUser));
        mockUser.save.mockReturnValue(Promise.resolve(mockUser));
        const result = await (0, verify_user_service_1.verifyUserService)(verifyRequest);
        // Assertions
        expect(user_model_1.default.findById).toHaveBeenCalledWith(verifyRequest.userId);
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
        user_model_1.default.findById.mockReturnValue(Promise.resolve(null));
        await expect((0, verify_user_service_1.verifyUserService)(verifyRequest)).rejects.toThrow(http_error_1.HttpError);
        await expect((0, verify_user_service_1.verifyUserService)(verifyRequest)).rejects.toMatchObject({
            statusCode: 404,
            message: 'User not found',
        });
    });
});
