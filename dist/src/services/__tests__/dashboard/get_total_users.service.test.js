"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const user_type_constant_1 = __importDefault(require("../../../constant/user_type.constant"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const get_total_users_service_1 = require("../../dashboard/get_total_users.service");
// Mock dependencies
globals_1.jest.mock('../../../models/user.model');
describe('getTotalUsersService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    it('should return total number of users with role USER', async () => {
        // Mock User.countDocuments result
        user_model_1.default.countDocuments.mockReturnValue(Promise.resolve(42));
        const result = await (0, get_total_users_service_1.getTotalUsersService)();
        // Assertions
        expect(user_model_1.default.countDocuments).toHaveBeenCalledWith({ role: user_type_constant_1.default.USER });
        expect(result).toEqual({ totalUsers: 42 });
    });
});
