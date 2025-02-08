import MedicalQueue from '../../models/medical_queue.model';

export const getQueueByUserService = async (userId: string) => {
  // Get all queues with 'waiting' status, sorted by timeSchedule (FIFO order)
  const waitingQueue = await MedicalQueue.find({ status: 'waiting' })
    .sort({ timeSchedule: 1 })
    .select('_id userId timeSchedule');

  // Find the position of the user's queue
  const userQueue = waitingQueue.findIndex((queue) => queue.userId === userId);

  return {
    position: userQueue !== -1 ? userQueue + 1 : null, // Position starts from 1
    totalWaiting: waitingQueue.length,
    userQueue: await MedicalQueue.find({ userId }), // Get all queues of user
  };
};
