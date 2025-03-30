"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicineReminderListByUserIdService = getMedicineReminderListByUserIdService;
const medicine_reminder_model_1 = __importDefault(require("../../models/medicine_reminder.model"));
async function getMedicineReminderListByUserIdService(userId) {
    const medicineReminderList = medicine_reminder_model_1.default.find({
        userId,
    });
    return medicineReminderList;
}
