import { jest } from '@jest/globals';

import MedicineReminder, {
  IMedicineReminder,
} from '../../../models/medicine_reminder.model';
import { getMedicineReminderListByUserIdService } from '../../medicine_reminder/get_medicine_reminder_list_by_user_id.service';

// Mock dependencies
jest.mock('../../../models/medicine_reminder.model');

describe('getMedicineReminderListByUserIdService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';
  const mockReminders: Partial<IMedicineReminder>[] = [
    {
      _id: '1',
      userId,
      name: 'Aspirin',
      time: '09:00',
      isEveryday: true,
    },
    {
      _id: '2',
      userId,
      name: 'Vitamin C',
      time: '12:00',
      isEveryday: true,
    },
  ];

  it('should return list of medicine reminders for user', async () => {
    (MedicineReminder.find as jest.Mock).mockReturnValue(
      Promise.resolve(mockReminders as IMedicineReminder[])
    );

    const result = await getMedicineReminderListByUserIdService(userId);

    expect(MedicineReminder.find).toHaveBeenCalledWith({ userId });
    expect(result).toEqual(mockReminders);
  });
});
