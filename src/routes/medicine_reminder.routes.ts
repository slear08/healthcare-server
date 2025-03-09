import express from 'express';

import {
  createMedicineReminderController,
  deleteMedicineReminderController,
  getMedicineReminderListByUserIdController,
  updateMedicineReminderController,
} from '../controllers/medicine_reminder';

const router = express.Router();

router.post('/create', createMedicineReminderController);
router.put('/update/:reminderId', updateMedicineReminderController);
router.get('/list', getMedicineReminderListByUserIdController);
router.delete('/delete/:reminderId', deleteMedicineReminderController);

export default router;
