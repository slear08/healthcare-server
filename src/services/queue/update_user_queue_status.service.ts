import MedicalQueue from '../../models/medical_queue.model';
import { HttpError } from '../../utils/http-error';
import log from '../../utils/logger';

export async function updateUserQueueStatusService(
  userId: string,
  queueId: string,
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled',
  io: any // Socket.IO instance
) {
  const updatedQueue = await MedicalQueue.findOneAndUpdate(
    { _id: queueId, userId },
    { status },
    { new: true, runValidators: true }
  );

  if (!updatedQueue) {
    throw new HttpError(404, 'Queue not found or unauthorized');
  }

  try {
    // Emit socket event for real-time updates
    io.emit('queueStatusUpdate', {
      queueId,
      userId,
      status,
      updatedQueue,
    });
    log.info(`Emitted queueStatusUpdate event for queue ${queueId}`);
  } catch (error) {
    log.error('Error emitting queueStatusUpdate event:', error);
  }

  return updatedQueue;
}
