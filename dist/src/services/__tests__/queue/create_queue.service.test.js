"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medical_queue_model_1 = __importDefault(require("../../../models/medical_queue.model"));
const http_error_1 = require("../../../utils/http-error");
const queue_validator_util_1 = require("../../../utils/queue_validator/queue_validator.util");
const create_queue_service_1 = require("../../queue/create_queue.service");
globals_1.jest.mock('../../../models/medical_queue.model');
globals_1.jest.mock('../../../utils/queue_validator/queue_validator.util');
describe('createQueueService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const userId = 'test-user-id';
    const purpose = 'checkup';
    const mockIo = {
        emit: globals_1.jest.fn(),
    };
    const mockQueueEntry = {
        _id: 'test-queue-id',
        userId,
        status: 'waiting',
        purpose,
        timeSchedule: new Date(),
    };
    it('should create new queue entry successfully', async () => {
        medical_queue_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        queue_validator_util_1.queueValidatorUtil.mockReturnValue(Promise.resolve(true));
        // Create a mock instance with save method
        const mockInstance = {
            ...mockQueueEntry,
            save: globals_1.jest.fn().mockReturnValue(Promise.resolve(mockQueueEntry)),
        };
        // Mock the constructor to return our mock instance
        medical_queue_model_1.default.mockImplementation(() => mockInstance);
        const result = await (0, create_queue_service_1.createQueueService)(userId, purpose, mockIo);
        expect(medical_queue_model_1.default.findOne).toHaveBeenCalledWith({
            userId,
            status: 'waiting',
        });
        expect(queue_validator_util_1.queueValidatorUtil).toHaveBeenCalled();
        expect(mockIo.emit).toHaveBeenCalledWith('newQueueEntry', {
            queueId: mockQueueEntry._id,
            userId,
            purpose,
            timeSchedule: mockQueueEntry.timeSchedule,
            status: mockQueueEntry.status,
        });
        expect(result).toEqual({
            message: 'Queue created successfully',
            queue: {
                ...mockQueueEntry,
                save: expect.any(Function),
            },
        });
    });
    it('should return message when queue already exists', async () => {
        medical_queue_model_1.default.findOne.mockReturnValue(Promise.resolve(mockQueueEntry));
        const result = await (0, create_queue_service_1.createQueueService)(userId, purpose, mockIo);
        expect(result).toBe('Queue entry already exists for this user');
    });
    it('should throw error when queue limit is reached', async () => {
        medical_queue_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        queue_validator_util_1.queueValidatorUtil.mockReturnValue(Promise.resolve(false));
        await expect((0, create_queue_service_1.createQueueService)(userId, purpose, mockIo)).rejects.toThrow(new http_error_1.HttpError(400, 'Queue limit reached'));
    });
    it('should handle socket emission error gracefully', async () => {
        medical_queue_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        queue_validator_util_1.queueValidatorUtil.mockReturnValue(Promise.resolve(true));
        // Create a mock instance with save method
        const mockInstance = {
            ...mockQueueEntry,
            save: globals_1.jest.fn().mockReturnValue(Promise.resolve(mockQueueEntry)),
        };
        // Mock the constructor to return our mock instance
        medical_queue_model_1.default.mockImplementation(() => mockInstance);
        const mockIoWithError = {
            emit: globals_1.jest.fn().mockImplementation(() => {
                throw new Error('Socket error');
            }),
        };
        const result = await (0, create_queue_service_1.createQueueService)(userId, purpose, mockIoWithError);
        expect(result).toEqual({
            message: 'Queue created successfully',
            queue: {
                ...mockQueueEntry,
                save: expect.any(Function),
            },
        });
    });
});
