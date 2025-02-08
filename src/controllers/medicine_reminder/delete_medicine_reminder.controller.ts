import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { deleteMedicineReminderService } from '../../services/medicine_reminder/delete_medicine_reminder.service';

export async function deleteMedicineReminderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.user as UserInterface;
    const userId = _id;
    const { medicineReminderId } = req.params;

    await deleteMedicineReminderService(userId, medicineReminderId);

    res.json({ message: 'Reminder Deleted' });
  } catch (error) {
    next(error);
  }
}
