import MedicalQueue from '../../models/medical_queue.model';
import MedicalQueueLimit from '../../models/queue_limit.model';
import { HttpError } from '../../utils/http-error';

export async function updateQueueLimitService(
  status: 'ON' | 'OFF',
  limit: number
) {
  if (limit < 1) {
    throw new HttpError(400, 'Queue limit must be at least 1');
  }

  // Count active queues (waiting and in-progress)
  const activeQueueCount = await MedicalQueue.countDocuments({
    status: { $in: ['waiting', 'in-progress'] },
    deletedAt: null,
  });

  if (limit < activeQueueCount) {
    throw new HttpError(
      400,
      `Cannot set limit below current active queue count (${activeQueueCount} active queues)`
    );
  }

  const updatedQueueLimit = await MedicalQueueLimit.findOneAndUpdate(
    {},
    { $set: { status, limit } },
    { new: true, runValidators: true }
  );

  return updatedQueueLimit;
}
