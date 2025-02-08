import MedicalQueueLimit from '../../models/queue_limit.model';
import { HttpError } from '../../utils/http-error';

export async function updateQueueLimitService(
  status: 'ON' | 'OFF',
  limit: number
) {
  if (limit < 1) {
    throw new HttpError(400, 'Queue limit must be at least 1');
  }

  const updatedQueueLimit = await MedicalQueueLimit.findOneAndUpdate(
    {},
    { status, limit },
    { new: true, upsert: true, runValidators: true }
  );

  return updatedQueueLimit;
}
