import MedicineReminder, {
  IMedicineReminder,
} from '../../models/medicine_reminder.model';
import { HttpError } from '../../utils/http-error';

export async function updateMedicineReminderService(
  userId: string,
  reminderId: string,
  data: IMedicineReminder
) {
  const { name, numberToTake, isEveryday, time, reminderDate } = data;

  const existingReminder = await MedicineReminder.findOne({
    userId,
    name: { $regex: `^${name.toLowerCase()}$`, $options: 'i' },
    time,
    _id: { $ne: reminderId },
  });

  if (existingReminder) {
    throw new HttpError(
      409,
      'A reminder for this medicine at this time already exists.'
    );
  }

  const updatedMedicineReminder = await MedicineReminder.findOneAndUpdate(
    { _id: reminderId, userId },
    {
      name,
      numberToTake,
      isEveryday,
      time,
      reminderDate: isEveryday ? undefined : new Date(reminderDate as string),
    },
    { new: true, runValidators: true }
  );

  if (!updatedMedicineReminder) {
    throw new HttpError(404, 'Medicine reminder not found');
  }

  return updatedMedicineReminder;
}
