import MedicalQueueLimit from '../models/queue_limit.model';

export async function getQueueLimitHelper() {
  const queueLimit = await MedicalQueueLimit.findOne();
  return queueLimit ?? { status: 'ON', limit: 10 };
}
