import MedicalQueue from '../../models/medical_queue.model';
import MedicalQueueLimit from '../../models/queue_limit.model';
import User from '../../models/user.model';

export const getDataAnalyticsService = async () => {
  const totalUsers = await User.countDocuments();

  const getWeeklyTrend = () => {
    const days = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      days.push({
        day: date.toLocaleString('en-US', { weekday: 'long' }),
        date: date.toISOString().split('T')[0],
        isFuture: date > now,
      });
    }
    return days;
  };

  const weeklyTrend = getWeeklyTrend();
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const newUsersWeekly = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(weeklyTrend[0].date) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalQueuesWeekly = await MedicalQueue.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(weeklyTrend[0].date) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalWaitingToday = await MedicalQueue.countDocuments({
    status: 'waiting',
    createdAt: { $gte: todayDate },
  });

  const queueLimitData = await MedicalQueueLimit.findOne(
    {},
    { sort: { createdAt: -1 } }
  );
  const queueLimit = {
    status: queueLimitData?.status || 'OFF',
    limit: queueLimitData?.limit || 0,
  };

  const formatWeeklyData = (dataArray: any[]) => {
    return weeklyTrend.map((day) => ({
      name: day.day,
      value: dataArray.find((d) => d._id === day.date)?.count || 0,
    }));
  };

  const formattedUsersData = formatWeeklyData(newUsersWeekly);
  const formattedQueuesData = formatWeeklyData(totalQueuesWeekly);

  return {
    totalUsers,
    weeklyTrend: {
      newUsers: formattedUsersData,
      totalQueues: formattedQueuesData,
    },
    totalWaitingToday,
    queueLimit,
  };
};
