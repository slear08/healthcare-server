import MedicalQueue from '../../models/medical_queue.model';
import MedicalQueueLimit from '../../models/queue_limit.model';
import User from '../../models/user.model';

export const getDataAnalyticsService = async () => {
  const totalUsers = await User.countDocuments();

  const getWeeklyTrend = () => {
    const days = [];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      days.push({
        day: date.toLocaleString('en-US', { weekday: 'long' }),
        date: date.toISOString().split('T')[0],
        isFuture: dayOfWeek > today, // Mark future days
      });
    }
    return days;
  };

  const weeklyTrend = getWeeklyTrend();
  const todayDate = new Date().toISOString().split('T')[0];

  // Get new users count per day
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

  // Get queues count per day
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

  // Get total "waiting" queues for today
  const totalWaitingToday = await MedicalQueue.countDocuments({
    status: 'waiting',
    createdAt: { $gte: new Date(todayDate) },
  });

  // Get queue limit and status
  const queueLimitData = await MedicalQueueLimit.findOne().sort({
    createdAt: -1,
  });
  const queueLimit = {
    status: queueLimitData?.status || 'OFF',
    limit: queueLimitData?.limit || 0,
  };

  // Format weekly trend data and set future days to null
  const formatWeeklyData = (dataArray: any[]) => {
    return weeklyTrend.map((day) => ({
      name: day.day,
      value: day.isFuture
        ? null
        : dataArray.find((d) => d._id === day.date)?.count || 0,
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
