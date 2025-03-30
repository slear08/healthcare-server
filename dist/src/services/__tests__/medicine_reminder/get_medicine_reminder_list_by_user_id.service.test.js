"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medicine_reminder_model_1 = __importDefault(require("../../../models/medicine_reminder.model"));
const get_medicine_reminder_list_by_user_id_service_1 = require("../../medicine_reminder/get_medicine_reminder_list_by_user_id.service");
// Mock dependencies
globals_1.jest.mock('../../../models/medicine_reminder.model');
describe('getMedicineReminderListByUserIdService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const userId = 'test-user-id';
    const mockReminders = [
        {
            _id: '1',
            userId,
            name: 'Aspirin',
            time: '09:00',
            isEveryday: true,
        },
        {
            _id: '2',
            userId,
            name: 'Vitamin C',
            time: '12:00',
            isEveryday: true,
        },
    ];
    it('should return list of medicine reminders for user', async () => {
        medicine_reminder_model_1.default.find.mockReturnValue(Promise.resolve(mockReminders));
        const result = await (0, get_medicine_reminder_list_by_user_id_service_1.getMedicineReminderListByUserIdService)(userId);
        expect(medicine_reminder_model_1.default.find).toHaveBeenCalledWith({ userId });
        expect(result).toEqual(mockReminders);
    });
});
