import MedicineReminder from '../../models/medicine_reminder.model';
import { HttpError } from '../../utils/http-error';

export async function deleteMedicineReminderService(
  userId: string,
  reminderId: string
) {
  const deletedMedicineReminder = await MedicineReminder.findOneAndDelete({
    _id: reminderId,
    userId,
  });

  if (!deletedMedicineReminder) {
    throw new HttpError(404, 'Medicine reminder not found');
  }

  return deletedMedicineReminder;
}
