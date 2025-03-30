"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedicineReminderService = deleteMedicineReminderService;
const medicine_reminder_model_1 = __importDefault(require("../../models/medicine_reminder.model"));
const http_error_1 = require("../../utils/http-error");
async function deleteMedicineReminderService(userId, reminderId) {
    const deletedMedicineReminder = await medicine_reminder_model_1.default.findOneAndDelete({
        _id: reminderId,
        userId,
    });
    if (!deletedMedicineReminder) {
        throw new http_error_1.HttpError(404, 'Medicine reminder not found');
    }
    return deletedMedicineReminder;
}
