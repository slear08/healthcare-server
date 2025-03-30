"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medicine_reminder_model_1 = __importDefault(require("../../../models/medicine_reminder.model"));
const http_error_1 = require("../../../utils/http-error");
const create_medicine_reminder_service_1 = require("../../medicine_reminder/create_medicine_reminder.service");
// Mock dependencies
globals_1.jest.mock('../../../models/medicine_reminder.model');
describe('createMedicineReminderService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const userId = 'test-user-id';
    const mockReminderData = {
        name: 'Aspirin',
        numberToTake: 1,
        isEveryday: true,
        time: '09:00',
    };
    const mockReminderWithDate = {
        ...mockReminderData,
        isEveryday: false,
        reminderDate: '2024-03-25',
    };
    it('should create a new medicine reminder successfully', async () => {
        // Mock findOne to return null (no existing reminder)
        medicine_reminder_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        // Mock save
        const mockSave = globals_1.jest
            .fn()
            .mockReturnValue(Promise.resolve({ ...mockReminderData, userId }));
        const mockConstructor = globals_1.jest.fn().mockReturnValue({ save: mockSave });
        medicine_reminder_model_1.default.mockImplementation(mockConstructor);
        await (0, create_medicine_reminder_service_1.createMedicineReminderService)(userId, mockReminderData);
        // Assertions
        expect(medicine_reminder_model_1.default.findOne).toHaveBeenCalledWith({
            userId,
            name: {
                $regex: `^${mockReminderData.name?.toLowerCase()}$`,
                $options: 'i',
            },
            time: mockReminderData.time,
        });
        expect(mockConstructor).toHaveBeenCalledWith({
            ...mockReminderData,
            userId,
        });
        expect(mockSave).toHaveBeenCalled();
    });
    it('should create a reminder with specific date when not everyday', async () => {
        medicine_reminder_model_1.default.findOne.mockReturnValue(Promise.resolve(null));
        const mockSave = globals_1.jest.fn().mockReturnValue(Promise.resolve({
            ...mockReminderWithDate,
            userId,
        }));
        const mockConstructor = globals_1.jest.fn().mockReturnValue({ save: mockSave });
        medicine_reminder_model_1.default.mockImplementation(mockConstructor);
        await (0, create_medicine_reminder_service_1.createMedicineReminderService)(userId, mockReminderWithDate);
        expect(mockConstructor).toHaveBeenCalledWith({
            ...mockReminderWithDate,
            reminderDate: new Date(mockReminderWithDate.reminderDate),
            userId,
        });
    });
    it('should throw error when reminder already exists', async () => {
        medicine_reminder_model_1.default.findOne.mockReturnValue(Promise.resolve({
            ...mockReminderData,
            userId,
        }));
        await expect((0, create_medicine_reminder_service_1.createMedicineReminderService)(userId, mockReminderData)).rejects.toThrow(new http_error_1.HttpError(409, 'You already have a reminder for this medicine at this time.'));
    });
});
