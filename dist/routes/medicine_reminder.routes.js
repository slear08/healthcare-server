"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicine_reminder_1 = require("../controllers/medicine_reminder");
const router = express_1.default.Router();
router.post('/create', medicine_reminder_1.createMedicineReminderController);
router.put('/update/:reminderId', medicine_reminder_1.updateMedicineReminderController);
router.get('/list', medicine_reminder_1.getMedicineReminderListByUserIdController);
router.delete('/delete/:reminderId', medicine_reminder_1.deleteMedicineReminderController);
exports.default = router;
