import MedicalQueue from '../../models/medical_queue.model';
import { UserInterface } from '../../models/user.model';
import { HttpError } from '../../utils/http-error';
import log from '../../utils/logger';

interface PopulatedQueue {
  _id: string;
  userId: UserInterface;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  purpose: 'checkup' | 'medicine-request';
  timeSchedule: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export async function cancelUserQueueStatusService(
  userId: string,
  queueId: string,
  io: any // Socket.IO instance
) {
  const updatedQueue = (await MedicalQueue.findOneAndUpdate(
    { _id: queueId, userId },
    { status: 'cancelled' },
    { new: true, runValidators: true }
  ).populate('userId', 'name email profile')) as unknown as PopulatedQueue;

  if (!updatedQueue) {
    throw new HttpError(404, 'Queue not found or unauthorized');
  }

  try {
    // Emit socket event for real-time updates
    io.emit('handleCancelQueue', {
      queueId: updatedQueue._id,
      userId: updatedQueue.userId._id,
      status: 'cancelled',
      name: updatedQueue.userId.name,
      profile: updatedQueue.userId.profile,
      purpose: updatedQueue.purpose,
      timeSchedule: updatedQueue.timeSchedule,
    });
    log.info(`Emitted handleCancelQueue event for queue ${updatedQueue._id}`);
  } catch (error) {
    log.error('Error emitting handleCancelQueue event:', error);
  }

  return updatedQueue;
}
