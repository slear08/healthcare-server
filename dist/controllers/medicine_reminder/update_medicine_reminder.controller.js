"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicineReminderController = updateMedicineReminderController;
const update_medicine_reminder_service_1 = require("../../services/medicine_reminder/update_medicine_reminder.service");
async function updateMedicineReminderController(req, res, next) {
    try {
        const { reminderId } = req.params;
        const { _id } = req.user;
        const userId = _id;
        const data = req.body;
        const updatedReminder = await (0, update_medicine_reminder_service_1.updateMedicineReminderService)(userId, reminderId, data);
        res.json({ message: 'Reminder Updated', data: updatedReminder });
    }
    catch (error) {
        next(error);
    }
}
