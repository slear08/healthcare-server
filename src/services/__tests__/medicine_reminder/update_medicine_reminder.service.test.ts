import { jest } from '@jest/globals';

import MedicineReminder, {
  IMedicineReminder,
} from '../../../models/medicine_reminder.model';
import { HttpError } from '../../../utils/http-error';
import { updateMedicineReminderService } from '../../medicine_reminder/update_medicine_reminder.service';

// Mock dependencies
jest.mock('../../../models/medicine_reminder.model');

describe('updateMedicineReminderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';
  const reminderId = 'test-reminder-id';
  const mockUpdateData: Partial<IMedicineReminder> = {
    name: 'Aspirin',
    numberToTake: 1,
    isEveryday: true,
    time: '09:00',
  };

  const mockUpdateDataWithDate: Partial<IMedicineReminder> = {
    ...mockUpdateData,
    isEveryday: false,
    reminderDate: '2024-03-25',
  };

  const mockUpdatedReminder: Partial<IMedicineReminder> = {
    _id: reminderId,
    userId,
    ...mockUpdateData,
  };

  it('should update medicine reminder successfully', async () => {
    // Mock findOne to return null (no existing reminder with same name and time)
    (MedicineReminder.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );

    // Mock findOneAndUpdate
    (MedicineReminder.findOneAndUpdate as jest.Mock).mockReturnValue(
      Promise.resolve(mockUpdatedReminder as IMedicineReminder)
    );

    const result = await updateMedicineReminderService(
      userId,
      reminderId,
      mockUpdateData as IMedicineReminder
    );

    expect(MedicineReminder.findOne).toHaveBeenCalledWith({
      userId,
      name: {
        $regex: `^${mockUpdateData.name?.toLowerCase()}$`,
        $options: 'i',
      },
      time: mockUpdateData.time,
      _id: { $ne: reminderId },
    });
    expect(MedicineReminder.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: reminderId, userId },
      {
        ...mockUpdateData,
      },
      { new: true, runValidators: true }
    );
    expect(result).toEqual(mockUpdatedReminder);
  });

  it('should update reminder with specific date when not everyday', async () => {
    (MedicineReminder.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );
    (MedicineReminder.findOneAndUpdate as jest.Mock).mockReturnValue(
      Promise.resolve({
        ...mockUpdatedReminder,
        ...mockUpdateDataWithDate,
      } as IMedicineReminder)
    );

    const result = await updateMedicineReminderService(
      userId,
      reminderId,
      mockUpdateDataWithDate as IMedicineReminder
    );

    expect(MedicineReminder.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: reminderId, userId },
      {
        ...mockUpdateDataWithDate,
        reminderDate: new Date(mockUpdateDataWithDate.reminderDate as string),
      },
      { new: true, runValidators: true }
    );
    expect(result.reminderDate).toBeDefined();
  });

  it('should throw error when reminder already exists with same name and time', async () => {
    (MedicineReminder.findOne as jest.Mock).mockReturnValue(
      Promise.resolve({
        ...mockUpdateData,
        userId,
        _id: 'different-id',
      } as IMedicineReminder)
    );

    await expect(
      updateMedicineReminderService(
        userId,
        reminderId,
        mockUpdateData as IMedicineReminder
      )
    ).rejects.toThrow(
      new HttpError(
        409,
        'A reminder for this medicine at this time already exists.'
      )
    );
  });

  it('should throw error when reminder not found', async () => {
    (MedicineReminder.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );
    (MedicineReminder.findOneAndUpdate as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );

    await expect(
      updateMedicineReminderService(
        userId,
        reminderId,
        mockUpdateData as IMedicineReminder
      )
    ).rejects.toThrow(new HttpError(404, 'Medicine reminder not found'));
  });
});
