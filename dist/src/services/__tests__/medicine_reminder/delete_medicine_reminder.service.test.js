"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medicine_reminder_model_1 = __importDefault(require("../../../models/medicine_reminder.model"));
const http_error_1 = require("../../../utils/http-error");
const delete_medicine_reminder_service_1 = require("../../medicine_reminder/delete_medicine_reminder.service");
// Mock dependencies
globals_1.jest.mock('../../../models/medicine_reminder.model');
describe('deleteMedicineReminderService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const userId = 'test-user-id';
    const reminderId = 'test-reminder-id';
    const mockReminder = {
        _id: reminderId,
        userId,
        name: 'Aspirin',
        time: '09:00',
    };
    it('should delete medicine reminder successfully', async () => {
        medicine_reminder_model_1.default.findOneAndDelete.mockReturnValue(Promise.resolve(mockReminder));
        const result = await (0, delete_medicine_reminder_service_1.deleteMedicineReminderService)(userId, reminderId);
        expect(medicine_reminder_model_1.default.findOneAndDelete).toHaveBeenCalledWith({
            _id: reminderId,
            userId,
        });
        expect(result).toEqual(mockReminder);
    });
    it('should throw error when reminder not found', async () => {
        medicine_reminder_model_1.default.findOneAndDelete.mockReturnValue(Promise.resolve(null));
        await expect((0, delete_medicine_reminder_service_1.deleteMedicineReminderService)(userId, reminderId)).rejects.toThrow(new http_error_1.HttpError(404, 'Medicine reminder not found'));
    });
});
