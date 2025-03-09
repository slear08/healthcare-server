import MedicalQueue from '../../models/medical_queue.model';

export const getActiveQueueByUserIdService = async (userId: string) => {
  // Get all queues with 'waiting' status, sorted by timeSchedule (FIFO order)
  const waitingQueue = await MedicalQueue.find({
    status: { $in: ['waiting', 'in-progress'] },
  })
    .sort({ timeSchedule: 1 })
    .select('_id userId timeSchedule');

  // Find the position of the user's queue
  const userQueue = waitingQueue.findIndex((queue) => queue.userId === userId);

  return {
    position: userQueue !== -1 ? userQueue + 1 : null,
    totalWaiting: waitingQueue.length,
    userQueue: await MedicalQueue.find({
      userId,
      status: { $in: ['waiting', 'in-progress'] },
    }),
  };
};
