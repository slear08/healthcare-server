"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicineReminderService = createMedicineReminderService;
const medicine_reminder_model_1 = __importDefault(require("../../models/medicine_reminder.model"));
const http_error_1 = require("../../utils/http-error");
async function createMedicineReminderService(userId, data) {
    const { name, numberToTake, isEveryday, time, reminderDate } = data;
    const existingReminder = await medicine_reminder_model_1.default.findOne({
        userId,
        name: { $regex: `^${name.toLowerCase()}$`, $options: 'i' },
        time,
    });
    if (existingReminder) {
        throw new http_error_1.HttpError(409, 'You already have a reminder for this medicine at this time.');
    }
    const medicineReminder = new medicine_reminder_model_1.default({
        name,
        numberToTake,
        isEveryday,
        time,
        reminderDate: isEveryday ? undefined : new Date(reminderDate),
        userId,
    });
    await medicineReminder.save();
}
