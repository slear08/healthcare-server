import MedicineReminder, {
  IMedicineReminder,
} from '../../models/medicine_reminder.model';
import { HttpError } from '../../utils/http-error';

export async function updateMedicineReminderService(
  userId: string,
  data: IMedicineReminder
) {
  const { _id, name, numberToTake, isEveryday, time, reminderDate } = data;

  const updatedMedicineReminder = await MedicineReminder.findOneAndUpdate(
    { _id, userId },
    { name, numberToTake, isEveryday, time, reminderDate },
    { new: true, runValidators: true }
  );

  if (!updatedMedicineReminder) {
    throw new HttpError(404, 'Medicine reminder not found');
  }

  return updatedMedicineReminder;
}
