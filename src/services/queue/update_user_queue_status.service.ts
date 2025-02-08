import MedicalQueue from '../../models/medical_queue.model';
import { HttpError } from '../../utils/http-error';

export async function updateUserQueueStatusService(
  userId: string,
  queueId: string,
  status: 'waiting' | 'in-progress' | 'completed'
) {
  const updatedQueue = await MedicalQueue.findOneAndUpdate(
    { _id: queueId, userId },
    { status },
    { new: true, runValidators: true }
  );

  if (!updatedQueue) {
    throw new HttpError(404, 'Queue not found or unauthorized');
  }

  return updatedQueue;
}
