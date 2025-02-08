import { Express } from 'express';

import { PassportAuthMiddleware } from '../middlewares/auth/passport_auth.middleware';
import AuthRoutes from './auth.routes';
import MedicalQueueRoutes from './medical-queue.routes';
import MedicineReminderRoutes from './medicine_reminder.routes';
import PassportRoutes from './passport.routes';

const Routes = (app: Express) => {
  // PASSPORT AUTHENTICATION
  app.use('/api', PassportRoutes);
  // ADMIN AUTHENTICATION
  app.use('/api/auth', AuthRoutes);

  // FEATURES
  app.use('/api/queue', MedicalQueueRoutes);
  app.use('/api/reminder', PassportAuthMiddleware, MedicineReminderRoutes);
};

export default Routes;
