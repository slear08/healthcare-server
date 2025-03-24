import { jest } from '@jest/globals';

import MedicineReminder, {
  IMedicineReminder,
} from '../../../models/medicine_reminder.model';
import { HttpError } from '../../../utils/http-error';
import { createMedicineReminderService } from '../../medicine_reminder/create_medicine_reminder.service';

// Mock dependencies
jest.mock('../../../models/medicine_reminder.model');

describe('createMedicineReminderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';
  const mockReminderData: Partial<IMedicineReminder> = {
    name: 'Aspirin',
    numberToTake: 1,
    isEveryday: true,
    time: '09:00',
  };

  const mockReminderWithDate: Partial<IMedicineReminder> = {
    ...mockReminderData,
    isEveryday: false,
    reminderDate: '2024-03-25',
  };

  it('should create a new medicine reminder successfully', async () => {
    // Mock findOne to return null (no existing reminder)
    (MedicineReminder.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );

    // Mock save
    const mockSave = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ ...mockReminderData, userId } as IMedicineReminder)
      );
    const mockConstructor = jest.fn().mockReturnValue({ save: mockSave });
    (MedicineReminder as unknown as jest.Mock).mockImplementation(
      mockConstructor
    );

    await createMedicineReminderService(
      userId,
      mockReminderData as IMedicineReminder
    );

    // Assertions
    expect(MedicineReminder.findOne).toHaveBeenCalledWith({
      userId,
      name: {
        $regex: `^${mockReminderData.name?.toLowerCase()}$`,
        $options: 'i',
      },
      time: mockReminderData.time,
    });
    expect(mockConstructor).toHaveBeenCalledWith({
      ...mockReminderData,
      userId,
    });
    expect(mockSave).toHaveBeenCalled();
  });

  it('should create a reminder with specific date when not everyday', async () => {
    (MedicineReminder.findOne as jest.Mock).mockReturnValue(
      Promise.resolve(null)
    );

    const mockSave = jest.fn().mockReturnValue(
      Promise.resolve({
        ...mockReminderWithDate,
        userId,
      } as IMedicineReminder)
    );
    const mockConstructor = jest.fn().mockReturnValue({ save: mockSave });
    (MedicineReminder as unknown as jest.Mock).mockImplementation(
      mockConstructor
    );

    await createMedicineReminderService(
      userId,
      mockReminderWithDate as IMedicineReminder
    );

    expect(mockConstructor).toHaveBeenCalledWith({
      ...mockReminderWithDate,
      reminderDate: new Date(mockReminderWithDate.reminderDate as string),
      userId,
    });
  });

  it('should throw error when reminder already exists', async () => {
    (MedicineReminder.findOne as jest.Mock).mockReturnValue(
      Promise.resolve({
        ...mockReminderData,
        userId,
      } as IMedicineReminder)
    );

    await expect(
      createMedicineReminderService(
        userId,
        mockReminderData as IMedicineReminder
      )
    ).rejects.toThrow(
      new HttpError(
        409,
        'You already have a reminder for this medicine at this time.'
      )
    );
  });
});
