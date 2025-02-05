import { Express } from 'express';

import AuthRoutes from './auth.routes';
import MedicalQueueRoutes from './medical-queue.routes';
import PassportRoutes from './passport.routes';

const Routes = (app: Express) => {
  // PASSPORT AUTHENTICATION
  app.use('/api', PassportRoutes);
  // ADMIN AUTHENTICATION
  app.use('/api/auth', AuthRoutes);

  // FEATURES
  app.use('/api/queue', MedicalQueueRoutes);
};

export default Routes;
