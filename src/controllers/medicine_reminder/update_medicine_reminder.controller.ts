import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { updateMedicineReminderService } from '../../services/medicine_reminder/update_medicine_reminder.service';

export async function updateMedicineReminderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { reminderId } = req.params;
    const { _id } = req.user as UserInterface;
    const userId = _id;
    const data = req.body;

    const updatedReminder = await updateMedicineReminderService(
      userId,
      reminderId,
      data
    );

    res.json({ message: 'Reminder Updated', data: updatedReminder });
  } catch (error) {
    next(error);
  }
}
