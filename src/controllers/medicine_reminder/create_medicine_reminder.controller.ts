import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { createMedicineReminderService } from '../../services/medicine_reminder/create_medicine_reminder.service';

export async function createMedicineReminderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.user as UserInterface;
    const userId = _id;
    const data = req.body;

    await createMedicineReminderService(userId, data);

    res.json({ message: 'Reminder Created' });
  } catch (error) {
    next(error);
  }
}
