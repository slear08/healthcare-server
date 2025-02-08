import MedicineReminder, {
  IMedicineReminder,
} from '../../models/medicine_reminder.model';

export async function createMedicineReminderService(
  userId: string,
  data: IMedicineReminder
) {
  const { name, numberToTake, isEveryday, time, reminderDate } = data;

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
