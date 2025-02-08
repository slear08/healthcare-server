import MedicalQueue from '../../models/medical_queue.model';
import { HttpError } from '../../utils/http-error';
import { queueValidatorUtil } from '../../utils/queue_validator/queue_validator.util';

export const createQueueService = async (
  userId: string,
  purpose: 'checkup' | 'medicine-request'
) => {
  const existingQueue = await MedicalQueue.findOne({ userId });

  if (existingQueue) {
    return 'Queue entry already exists for this user';
  }

  if (!(await queueValidatorUtil())) {
    throw new HttpError(400, 'Queue limit reached');
  }

  const queueEntry = new MedicalQueue({
    userId,
    status: 'waiting',
    purpose,
    timeSchedule: new Date(),
  });

  await queueEntry.save();

  return 'Queue created';
};
