import MedicalQueue from '../../models/medical_queue.model';

export const getQueueHistoryByUserService = async (userId: string) => {
  return await MedicalQueue.find({ userId });
};
