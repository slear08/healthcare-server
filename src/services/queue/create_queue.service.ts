import MedicalQueue from '../../models/medical_queue.model';
import { HttpError } from '../../utils/http-error';
import log from '../../utils/logger';
import { queueValidatorUtil } from '../../utils/queue_validator/queue_validator.util';

export const createQueueService = async (
  userId: string,
  purpose: 'checkup' | 'medicine-request',
  io: any // Socket.IO instance
) => {
  const existingQueue = await MedicalQueue.findOne({
    userId,
    status: 'waiting',
  });

  if (existingQueue) {
    return 'Queue entry already exists for this user';
  }

  if (!(await queueValidatorUtil())) {
    throw new HttpError(400, 'Queue limit reached');
  }

  const queueEntry = new MedicalQueue({
    userId,
    status: 'waiting',
    purpose,
    timeSchedule: new Date(),
  });

  await queueEntry.save();

  try {
    // Emit socket event for new queue entry
    io.emit('newQueueEntry', {
      queueId: queueEntry._id,
      userId,
      purpose,
      timeSchedule: queueEntry.timeSchedule,
      status: queueEntry.status,
    });
    log.info(`Emitted newQueueEntry event for queue ${queueEntry._id}`);
  } catch (error) {
    log.error('Error emitting newQueueEntry event:', error);
  }

  return {
    message: 'Queue created successfully',
    queue: queueEntry,
  };
};
