import MedicineReminder, {
  IMedicineReminder,
} from '../../models/medicine_reminder.model';
import { HttpError } from '../../utils/http-error';

export async function createMedicineReminderService(
  userId: string,
  data: IMedicineReminder
) {
  const { name, numberToTake, isEveryday, time, reminderDate } = data;

  const existingReminder = await MedicineReminder.findOne({
    userId,
    name: { $regex: `^${name.toLowerCase()}$`, $options: 'i' },
    time,
  });

  if (existingReminder) {
    throw new HttpError(
      409,
      'You already have a reminder for this medicine at this time.'
    );
  }

  const medicineReminder = new MedicineReminder({
    name,
    numberToTake,
    isEveryday,
    time,
    reminderDate: isEveryday ? undefined : new Date(reminderDate as string),
    userId,
  });

  await medicineReminder.save();
}
