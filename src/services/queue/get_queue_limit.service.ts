import MedicalQueueLimit from '../../models/queue_limit.model';

export const getQueueLimitService = async () => {
  const queueLimit = await MedicalQueueLimit.findOne();

  if (!queueLimit) {
    const defaultSettings = new MedicalQueueLimit({
      status: 'ON',
      limit: 30,
    });
    await defaultSettings.save();
    return defaultSettings;
  }

  return queueLimit;
};
