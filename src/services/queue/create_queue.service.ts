import MedicalQueue from '../../models/medical_queue.model';

export const createQueueService = async (userId: string) => {
  const existingQueue = await MedicalQueue.findOne({ userId });

  if (existingQueue) {
    return 'Queue entry already exists for this user';
  }

  const queueEntry = new MedicalQueue({
    userId,
    status: 'waiting',
    timeSchedule: new Date(),
  });

  await queueEntry.save();

  return 'Queue created';
};
