import MedicalQueue from '../../models/medical_queue.model';

export const getQueueByUserService = async (userId: string) => {
  return await MedicalQueue.find({ userId });
};
