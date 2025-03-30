"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicineReminderController = createMedicineReminderController;
const create_medicine_reminder_service_1 = require("../../services/medicine_reminder/create_medicine_reminder.service");
async function createMedicineReminderController(req, res, next) {
    try {
        const { _id } = req.user;
        const userId = _id;
        const data = req.body;
        await (0, create_medicine_reminder_service_1.createMedicineReminderService)(userId, data);
        res.json({ message: 'Reminder Created' });
    }
    catch (error) {
        next(error);
    }
}
