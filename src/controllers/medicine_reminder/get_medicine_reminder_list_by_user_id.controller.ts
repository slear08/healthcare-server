import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { getMedicineReminderListByUserIdService } from '../../services/medicine_reminder/get_medicine_reminder_list_by_user_id.service';

export async function getMedicineReminderListByUserIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.user as UserInterface;
    const userId = _id;

    const reminders = await getMedicineReminderListByUserIdService(userId);

    res.json({ message: 'Reminders Fetched', data: reminders });
  } catch (error) {
    next(error);
  }
}
