"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medical_queue_model_1 = __importDefault(require("../../../models/medical_queue.model"));
const get_queue_history_by_user_id_service_1 = require("../../queue/get_queue_history_by_user_id.service");
globals_1.jest.mock('../../../models/medical_queue.model');
describe('getQueueHistoryByUserService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const userId = 'test-user-id';
    const mockQueueHistory = [
        {
            _id: '1',
            userId,
            status: 'completed',
            purpose: 'checkup',
            timeSchedule: new Date(),
        },
        {
            _id: '2',
            userId,
            status: 'cancelled',
            purpose: 'medicine-request',
            timeSchedule: new Date(),
        },
    ];
    it('should return queue history for user', async () => {
        medical_queue_model_1.default.find.mockReturnValue(Promise.resolve(mockQueueHistory));
        const result = await (0, get_queue_history_by_user_id_service_1.getQueueHistoryByUserService)(userId);
        expect(medical_queue_model_1.default.find).toHaveBeenCalledWith({ userId });
        expect(result).toEqual(mockQueueHistory);
    });
});
