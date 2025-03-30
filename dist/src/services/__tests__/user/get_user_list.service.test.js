"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const user_type_constant_1 = __importDefault(require("../../../constant/user_type.constant"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const get_user_list_service_1 = require("../../user/get_user_list.service");
// Mock dependencies
globals_1.jest.mock('../../../models/user.model');
describe('getUserListService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const mockUsers = [
        {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: user_type_constant_1.default.USER,
            password: 'hashedPassword1',
        },
        {
            _id: '2',
            name: 'Jane Doe',
            email: 'jane@example.com',
            role: user_type_constant_1.default.USER,
            password: 'hashedPassword2',
        },
    ];
    it('should return list of users without passwords', async () => {
        // Mock User.find().select() chain
        const mockSelect = globals_1.jest.fn().mockReturnValue(Promise.resolve(mockUsers));
        const mockFind = globals_1.jest.fn().mockReturnValue({ select: mockSelect });
        user_model_1.default.find = mockFind;
        const result = await (0, get_user_list_service_1.getUserListService)();
        // Assertions
        expect(user_model_1.default.find).toHaveBeenCalledWith({ role: user_type_constant_1.default.USER });
        expect(mockSelect).toHaveBeenCalledWith('-password');
        expect(result).toEqual(mockUsers);
    });
});
