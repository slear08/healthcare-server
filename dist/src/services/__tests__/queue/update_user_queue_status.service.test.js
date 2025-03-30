"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medical_queue_model_1 = __importDefault(require("../../../models/medical_queue.model"));
const http_error_1 = require("../../../utils/http-error");
const update_user_queue_status_service_1 = require("../../queue/update_user_queue_status.service");
globals_1.jest.mock('../../../models/medical_queue.model');
describe('updateUserQueueStatusService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const userId = 'test-user-id';
    const queueId = 'test-queue-id';
    const status = 'completed';
    const mockIo = {
        emit: globals_1.jest.fn(),
    };
    const mockUpdatedQueue = {
        _id: queueId,
        userId,
        status,
        purpose: 'checkup',
        timeSchedule: new Date(),
    };
    it('should update queue status and emit socket event', async () => {
        medical_queue_model_1.default.findOneAndUpdate.mockReturnValue(Promise.resolve(mockUpdatedQueue));
        const result = await (0, update_user_queue_status_service_1.updateUserQueueStatusService)(userId, queueId, status, mockIo);
        expect(medical_queue_model_1.default.findOneAndUpdate).toHaveBeenCalledWith({ _id: queueId, userId }, { status }, { new: true, runValidators: true });
        expect(mockIo.emit).toHaveBeenCalledWith('queueStatusUpdate', {
            queueId,
            userId,
            status,
            updatedQueue: mockUpdatedQueue,
        });
        expect(result).toEqual(mockUpdatedQueue);
    });
    it('should throw error when queue not found', async () => {
        medical_queue_model_1.default.findOneAndUpdate.mockReturnValue(Promise.resolve(null));
        await expect((0, update_user_queue_status_service_1.updateUserQueueStatusService)(userId, queueId, status, mockIo)).rejects.toThrow(new http_error_1.HttpError(404, 'Queue not found or unauthorized'));
    });
    it('should handle socket emission error gracefully', async () => {
        medical_queue_model_1.default.findOneAndUpdate.mockReturnValue(Promise.resolve(mockUpdatedQueue));
        const mockIoWithError = {
            emit: globals_1.jest.fn().mockImplementation(() => {
                throw new Error('Socket error');
            }),
        };
        const result = await (0, update_user_queue_status_service_1.updateUserQueueStatusService)(userId, queueId, status, mockIoWithError);
        expect(result).toEqual(mockUpdatedQueue);
    });
});
