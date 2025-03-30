"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medical_queue_model_1 = __importDefault(require("../../../models/medical_queue.model"));
const queue_limit_model_1 = __importDefault(require("../../../models/queue_limit.model"));
const http_error_1 = require("../../../utils/http-error");
const update_queue_limit_service_1 = require("../../queue/update_queue_limit.service");
globals_1.jest.mock('../../../models/medical_queue.model');
globals_1.jest.mock('../../../models/queue_limit.model');
describe('updateQueueLimitService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const mockUpdatedLimit = {
        status: 'ON',
        limit: 50,
    };
    it('should update queue limit successfully', async () => {
        medical_queue_model_1.default.countDocuments.mockReturnValue(Promise.resolve(10));
        queue_limit_model_1.default.findOneAndUpdate.mockReturnValue(Promise.resolve(mockUpdatedLimit));
        const result = await (0, update_queue_limit_service_1.updateQueueLimitService)('ON', 50);
        expect(medical_queue_model_1.default.countDocuments).toHaveBeenCalledWith({
            status: { $in: ['waiting', 'in-progress'] },
            deletedAt: null,
        });
        expect(queue_limit_model_1.default.findOneAndUpdate).toHaveBeenCalledWith({}, { $set: { status: 'ON', limit: 50 } }, { new: true, runValidators: true });
        expect(result).toEqual(mockUpdatedLimit);
    });
    it('should throw error when limit is less than 1', async () => {
        await expect((0, update_queue_limit_service_1.updateQueueLimitService)('ON', 0)).rejects.toThrow(new http_error_1.HttpError(400, 'Queue limit must be at least 1'));
    });
    it('should throw error when limit is less than active queues', async () => {
        medical_queue_model_1.default.countDocuments.mockReturnValue(Promise.resolve(20));
        await expect((0, update_queue_limit_service_1.updateQueueLimitService)('ON', 10)).rejects.toThrow(new http_error_1.HttpError(400, 'Cannot set limit below current active queue count (20 active queues)'));
    });
});
