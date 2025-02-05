import MedicalQueue from '../../models/medical_queue.model';

export const getQueueListService = async () => {
  return await MedicalQueue.find();
};
