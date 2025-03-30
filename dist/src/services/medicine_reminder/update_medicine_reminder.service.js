"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicineReminderService = updateMedicineReminderService;
const medicine_reminder_model_1 = __importDefault(require("../../models/medicine_reminder.model"));
const http_error_1 = require("../../utils/http-error");
async function updateMedicineReminderService(userId, reminderId, data) {
    const { name, numberToTake, isEveryday, time, reminderDate } = data;
    const existingReminder = await medicine_reminder_model_1.default.findOne({
        userId,
        name: { $regex: `^${name.toLowerCase()}$`, $options: 'i' },
        time,
        _id: { $ne: reminderId },
    });
    if (existingReminder) {
        throw new http_error_1.HttpError(409, 'A reminder for this medicine at this time already exists.');
    }
    const updatedMedicineReminder = await medicine_reminder_model_1.default.findOneAndUpdate({ _id: reminderId, userId }, {
        name,
        numberToTake,
        isEveryday,
        time,
        reminderDate: isEveryday ? undefined : new Date(reminderDate),
    }, { new: true, runValidators: true });
    if (!updatedMedicineReminder) {
        throw new http_error_1.HttpError(404, 'Medicine reminder not found');
    }
    return updatedMedicineReminder;
}
