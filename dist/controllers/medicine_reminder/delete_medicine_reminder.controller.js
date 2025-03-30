"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedicineReminderController = deleteMedicineReminderController;
const delete_medicine_reminder_service_1 = require("../../services/medicine_reminder/delete_medicine_reminder.service");
async function deleteMedicineReminderController(req, res, next) {
    try {
        const { _id } = req.user;
        const userId = _id;
        const { reminderId } = req.params;
        await (0, delete_medicine_reminder_service_1.deleteMedicineReminderService)(userId, reminderId);
        res.json({ message: 'Reminder Deleted' });
    }
    catch (error) {
        next(error);
    }
}
