"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medicine_reminder_model_1 = __importDefault(require("../../../models/medicine_reminder.model"));
const http_error_1 = require("../../../utils/http-error");
const update_medicine_reminder_service_1 = require("../../medicine_reminder/update_medicine_reminder.service");
// Mock dependencies
globals_1.jest.mock('../../../models/medicine_reminder.model');
describe('updateMedicineReminderService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const userId = 'test-user-id';
    const reminderId = 'test-reminder-id';
    const mockUpdateData = {
        name: 'Aspirin',
        numberToTake: 1,
        isEveryday: true,
        time: '09:00',
    };
    const mockUpdateDataWithDate = {
        ...mockUpdateData,
        isEveryday: false,
        reminderDate: '2024-03-25',
    };
    const mockUpdatedReminder = {
        _id: reminderId,
        userId,
        ...mockUpdateData,
    };
    it('should update medicine reminder successfully', async () => {
        // Mock findOne to return null (no existing reminder with same name and time)
        medicine_reminder_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        // Mock findOneAndUpdate
        medicine_reminder_model_1.default.findOneAndUpdate.mockReturnValue(Promise.resolve(mockUpdatedReminder));
        const result = await (0, update_medicine_reminder_service_1.updateMedicineReminderService)(userId, reminderId, mockUpdateData);
        expect(medicine_reminder_model_1.default.findOne).toHaveBeenCalledWith({
            userId,
            name: {
                $regex: `^${mockUpdateData.name?.toLowerCase()}$`,
                $options: 'i',
            },
            time: mockUpdateData.time,
            _id: { $ne: reminderId },
        });
        expect(medicine_reminder_model_1.default.findOneAndUpdate).toHaveBeenCalledWith({ _id: reminderId, userId }, {
            ...mockUpdateData,
        }, { new: true, runValidators: true });
        expect(result).toEqual(mockUpdatedReminder);
    });
    it('should update reminder with specific date when not everyday', async () => {
        medicine_reminder_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        medicine_reminder_model_1.default.findOneAndUpdate.mockReturnValue(Promise.resolve({
            ...mockUpdatedReminder,
            ...mockUpdateDataWithDate,
        }));
        const result = await (0, update_medicine_reminder_service_1.updateMedicineReminderService)(userId, reminderId, mockUpdateDataWithDate);
        expect(medicine_reminder_model_1.default.findOneAndUpdate).toHaveBeenCalledWith({ _id: reminderId, userId }, {
            ...mockUpdateDataWithDate,
            reminderDate: new Date(mockUpdateDataWithDate.reminderDate),
        }, { new: true, runValidators: true });
        expect(result.reminderDate).toBeDefined();
    });
    it('should throw error when reminder already exists with same name and time', async () => {
        medicine_reminder_model_1.default.findOne.mockReturnValue(Promise.resolve({
            ...mockUpdateData,
            userId,
            _id: 'different-id',
        }));
        await expect((0, update_medicine_reminder_service_1.updateMedicineReminderService)(userId, reminderId, mockUpdateData)).rejects.toThrow(new http_error_1.HttpError(409, 'A reminder for this medicine at this time already exists.'));
    });
    it('should throw error when reminder not found', async () => {
        medicine_reminder_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        medicine_reminder_model_1.default.findOneAndUpdate.mockReturnValue(Promise.resolve(null));
        await expect((0, update_medicine_reminder_service_1.updateMedicineReminderService)(userId, reminderId, mockUpdateData)).rejects.toThrow(new http_error_1.HttpError(404, 'Medicine reminder not found'));
    });
});
