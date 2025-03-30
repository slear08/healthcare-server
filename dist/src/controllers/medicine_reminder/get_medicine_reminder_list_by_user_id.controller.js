"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicineReminderListByUserIdController = getMedicineReminderListByUserIdController;
const get_medicine_reminder_list_by_user_id_service_1 = require("../../services/medicine_reminder/get_medicine_reminder_list_by_user_id.service");
async function getMedicineReminderListByUserIdController(req, res, next) {
    try {
        const { _id } = req.user;
        const userId = _id;
        const reminders = await (0, get_medicine_reminder_list_by_user_id_service_1.getMedicineReminderListByUserIdService)(userId);
        res.json({ message: 'Reminders Fetched', data: reminders });
    }
    catch (error) {
        next(error);
    }
}
