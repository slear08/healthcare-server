"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medical_queue_model_1 = __importDefault(require("../../../models/medical_queue.model"));
const get_active_queue_by_user_id_service_1 = require("../../queue/get_active_queue_by_user_id.service");
globals_1.jest.mock('../../../models/medical_queue.model');
describe('getActiveQueueByUserIdService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const userId = 'test-user-id';
    const mockWaitingQueues = [
        { _id: '1', userId: 'other-user', timeSchedule: new Date() },
        { _id: '2', userId, timeSchedule: new Date() },
        { _id: '3', userId: 'another-user', timeSchedule: new Date() },
    ];
    const mockUserQueue = [
        { _id: '2', userId, status: 'waiting', timeSchedule: new Date() },
    ];
    it('should return queue position and details', async () => {
        const mockFind = globals_1.jest.fn().mockReturnValue({
            sort: globals_1.jest.fn().mockReturnValue({
                select: globals_1.jest.fn().mockReturnValue(Promise.resolve(mockWaitingQueues)),
            }),
        });
        medical_queue_model_1.default.find.mockImplementation((criteria) => {
            if (criteria?.userId === userId) {
                return Promise.resolve(mockUserQueue);
            }
            return mockFind();
        });
        const result = await (0, get_active_queue_by_user_id_service_1.getActiveQueueByUserIdService)(userId);
        expect(result).toEqual({
            position: 2,
            totalWaiting: 3,
            userQueue: mockUserQueue,
        });
    });
    it('should return null position when user not in queue', async () => {
        const mockFind = globals_1.jest.fn().mockReturnValue({
            sort: globals_1.jest.fn().mockReturnValue({
                select: globals_1.jest.fn().mockReturnValue(Promise.resolve(mockWaitingQueues)),
            }),
        });
        medical_queue_model_1.default.find.mockImplementation((criteria) => {
            if (criteria?.userId === 'non-existent-user') {
                return Promise.resolve([]);
            }
            return mockFind();
        });
        const result = await (0, get_active_queue_by_user_id_service_1.getActiveQueueByUserIdService)('non-existent-user');
        expect(result).toEqual({
            position: null,
            totalWaiting: 3,
            userQueue: [],
        });
    });
});
