"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const queue_limit_model_1 = __importDefault(require("../../../models/queue_limit.model"));
const get_queue_limit_service_1 = require("../../queue/get_queue_limit.service");
globals_1.jest.mock('../../../models/queue_limit.model');
describe('getQueueLimitService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const mockQueueLimit = {
        status: 'ON',
        limit: 30,
    };
    it('should return existing queue limit', async () => {
        queue_limit_model_1.default.findOne.mockReturnValue(Promise.resolve(mockQueueLimit));
        const result = await (0, get_queue_limit_service_1.getQueueLimitService)();
        expect(queue_limit_model_1.default.findOne).toHaveBeenCalled();
        expect(result).toEqual(mockQueueLimit);
    });
    it('should create default queue limit when none exists', async () => {
        const mockSave = globals_1.jest.fn().mockReturnValue(Promise.resolve(mockQueueLimit));
        const mockInstance = {
            ...mockQueueLimit,
            save: mockSave,
        };
        const mockConstructor = globals_1.jest.fn().mockReturnValue(mockInstance);
        queue_limit_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        queue_limit_model_1.default.mockImplementation(mockConstructor);
        const result = await (0, get_queue_limit_service_1.getQueueLimitService)();
        expect(queue_limit_model_1.default.findOne).toHaveBeenCalled();
        expect(mockConstructor).toHaveBeenCalledWith({
            status: 'ON',
            limit: 30,
        });
        expect(mockSave).toHaveBeenCalled();
        expect(result).toEqual(mockInstance);
    });
});
