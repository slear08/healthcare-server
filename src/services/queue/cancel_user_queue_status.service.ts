import MedicalQueue from '../../models/medical_queue.model';
import { HttpError } from '../../utils/http-error';

export async function cancelUserQueueStatusService(
  userId: string,
  queueId: string
) {
  const updatedQueue = await MedicalQueue.findOneAndUpdate(
    { _id: queueId, userId },
    { status: 'cancelled' },
    { new: true, runValidators: true }
  );

  if (!updatedQueue) {
    throw new HttpError(404, 'Queue not found or unauthorized');
  }

  return updatedQueue;
}
