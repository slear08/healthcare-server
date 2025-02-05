import mongoose from 'mongoose';
import log from '../utils/logger';

export const DatabaseConnection = async (url: string): Promise<void> => {
  try {
    await mongoose.connect(url as string);
    log.info('Database connected successfully');
  } catch (error) {
    log.error('Database connection error:', error);
    process.exit(1);
  }
};
