import { getQueueLimitHelper } from '../../helper/get_queue_limit.helper';
import MedicalQueue from '../../models/medical_queue.model';

export async function queueValidatorUtil(): Promise<boolean> {
  const queueLimit = await getQueueLimitHelper();
  const activeQueues = await MedicalQueue.countDocuments({ status: 'waiting' });

  return queueLimit.status === 'ON' && activeQueues < queueLimit.limit;
}
