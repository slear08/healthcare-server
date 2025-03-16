import { Express } from 'express';

import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
import { PassportAuthMiddleware } from '../middlewares/auth/passport_auth.middleware';
import AuthRoutes from './auth.routes';
import DataAnalyticsRoutes from './data_analytics.routes';
import MedicalQueueRoutes from './medical_queue.routes';
import MedicineReminderRoutes from './medicine_reminder.routes';
import PassportRoutes from './passport.routes';
import QueueLimitRoutes from './queue.route';
import UserRoutes from './user.routes';

const Routes = (app: Express) => {
  // PASSPORT AUTHENTICATION
  app.use('/api', PassportRoutes);
  // ADMIN AUTHENTICATION
  app.use('/api/auth', AuthRoutes);

  // FEATURES
  app.use('/api/queue', MedicalQueueRoutes);
  app.use('/api/queue-limit', QueueLimitRoutes);
  app.use('/api/reminder', PassportAuthMiddleware, MedicineReminderRoutes);
  app.use('/api/user', AuthMiddleware, UserRoutes);
  app.use('/api/data-analytics', AuthMiddleware, DataAnalyticsRoutes);
};

export default Routes;
