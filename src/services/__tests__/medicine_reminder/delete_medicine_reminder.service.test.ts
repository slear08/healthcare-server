import { jest } from '@jest/globals';

import MedicineReminder, {
  IMedicineReminder,
} from '../../../models/medicine_reminder.model';
import { HttpError } from '../../../utils/http-error';
import { deleteMedicineReminderService } from '../../medicine_reminder/delete_medicine_reminder.service';

// Mock dependencies
jest.mock('../../../models/medicine_reminder.model');

describe('deleteMedicineReminderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';
  const reminderId = 'test-reminder-id';
  const mockReminder: Partial<IMedicineReminder> = {
    _id: reminderId,
    userId,
    name: 'Aspirin',
    time: '09:00',
  };

  it('should delete medicine reminder successfully', async () => {
    (MedicineReminder.findOneAndDelete as jest.Mock).mockReturnValue(
      Promise.resolve(mockReminder as IMedicineReminder)
    );

    const result = await deleteMedicineReminderService(userId, reminderId);

    expect(MedicineReminder.findOneAndDelete).toHaveBeenCalledWith({
      _id: reminderId,
      userId,
    });
    expect(result).toEqual(mockReminder);
  });

  it('should throw error when reminder not found', async () => {
    (MedicineReminder.findOneAndDelete as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );

    await expect(
      deleteMedicineReminderService(userId, reminderId)
    ).rejects.toThrow(new HttpError(404, 'Medicine reminder not found'));
  });
});
