"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medical_queue_model_1 = __importDefault(require("../../../models/medical_queue.model"));
const queue_limit_model_1 = __importDefault(require("../../../models/queue_limit.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const get_data_analytics_service_1 = require("../../dashboard/get_data_analytics.service");
// Mock dependencies
globals_1.jest.mock('../../../models/user.model');
globals_1.jest.mock('../../../models/medical_queue.model');
globals_1.jest.mock('../../../models/queue_limit.model');
describe('getDataAnalyticsService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
        // Mock current date to be consistent in tests
        globals_1.jest.useFakeTimers();
        globals_1.jest.setSystemTime(new Date('2024-03-24'));
    });
    afterEach(() => {
        globals_1.jest.useRealTimers();
    });
    const mockWeeklyUsersData = [
        { _id: '2024-03-18', count: 5 },
        { _id: '2024-03-19', count: 3 },
        { _id: '2024-03-20', count: 7 },
        { _id: '2024-03-21', count: 4 },
        { _id: '2024-03-22', count: 6 },
        { _id: '2024-03-23', count: 2 },
        { _id: '2024-03-24', count: 1 },
    ];
    const mockWeeklyQueuesData = [
        { _id: '2024-03-18', count: 10 },
        { _id: '2024-03-19', count: 8 },
        { _id: '2024-03-20', count: 12 },
        { _id: '2024-03-21', count: 9 },
        { _id: '2024-03-22', count: 11 },
        { _id: '2024-03-23', count: 7 },
        { _id: '2024-03-24', count: 5 },
    ];
    const mockQueueLimitData = {
        status: 'ON',
        limit: 50,
        createdAt: new Date(),
    };
    it('should return complete analytics data', async () => {
        // Mock User.countDocuments result
        user_model_1.default.countDocuments.mockReturnValue(Promise.resolve(100));
        // Mock User.aggregate result
        user_model_1.default.aggregate.mockReturnValue(Promise.resolve(mockWeeklyUsersData));
        // Mock MedicalQueue.aggregate result
        medical_queue_model_1.default.aggregate.mockReturnValue(Promise.resolve(mockWeeklyQueuesData));
        // Mock MedicalQueue.countDocuments result
        medical_queue_model_1.default.countDocuments.mockReturnValue(Promise.resolve(15));
        // Mock MedicalQueueLimit.findOne result
        queue_limit_model_1.default.findOne.mockReturnValue(Promise.resolve(mockQueueLimitData));
        const result = await (0, get_data_analytics_service_1.getDataAnalyticsService)();
        // Assertions
        expect(user_model_1.default.countDocuments).toHaveBeenCalled();
        expect(user_model_1.default.aggregate).toHaveBeenCalled();
        expect(medical_queue_model_1.default.aggregate).toHaveBeenCalled();
        expect(medical_queue_model_1.default.countDocuments).toHaveBeenCalledWith({
            status: 'waiting',
            createdAt: expect.any(Object),
        });
        expect(queue_limit_model_1.default.findOne).toHaveBeenCalledWith({}, { sort: { createdAt: -1 } });
        // Verify the structure of the response
        expect(result).toEqual({
            totalUsers: 100,
            weeklyTrend: {
                newUsers: expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        value: expect.any(Number),
                    }),
                ]),
                totalQueues: expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        value: expect.any(Number),
                    }),
                ]),
            },
            totalWaitingToday: 15,
            queueLimit: {
                status: 'ON',
                limit: 50,
            },
        });
    });
    it('should handle case when no queue limit data exists', async () => {
        // Mock User.countDocuments result
        user_model_1.default.countDocuments.mockReturnValue(Promise.resolve(100));
        // Mock User.aggregate result
        user_model_1.default.aggregate.mockReturnValue(Promise.resolve(mockWeeklyUsersData));
        // Mock MedicalQueue.aggregate result
        medical_queue_model_1.default.aggregate.mockReturnValue(Promise.resolve(mockWeeklyQueuesData));
        // Mock MedicalQueue.countDocuments result
        medical_queue_model_1.default.countDocuments.mockReturnValue(Promise.resolve(15));
        // Mock MedicalQueueLimit.findOne result to return null
        queue_limit_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        const result = await (0, get_data_analytics_service_1.getDataAnalyticsService)();
        // Verify the queueLimit has default values
        expect(result.queueLimit).toEqual({
            status: 'OFF',
            limit: 0,
        });
    });
});
