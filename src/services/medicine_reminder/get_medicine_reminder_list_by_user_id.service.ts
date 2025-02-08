import MedicineReminder, {
  IMedicineReminder,
} from '../../models/medicine_reminder.model';

export async function getMedicineReminderListByUserIdService(
  userId: string
): Promise<IMedicineReminder[]> {
  const medicineReminderList = MedicineReminder.find({
    userId,
  });

  return medicineReminderList;
}
