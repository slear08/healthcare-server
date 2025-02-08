import express from 'express';

import {
  createMedicineReminderController,
  deleteMedicineReminderController,
  getMedicineReminderListByUserIdController,
  updateMedicineReminderController,
} from '../controllers/medicine_reminder';

const router = express.Router();

router.post('/create', createMedicineReminderController);
router.put('/create', updateMedicineReminderController);
router.get('/update', getMedicineReminderListByUserIdController);
router.delete('/delete', deleteMedicineReminderController);

export default router;
