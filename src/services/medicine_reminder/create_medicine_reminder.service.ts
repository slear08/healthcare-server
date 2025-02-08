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
    reminderDate: isEveryday ? undefined : reminderDate,
    userId,
  });

  await medicineReminder.save();
}
