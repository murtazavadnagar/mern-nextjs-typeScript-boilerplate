import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGO_URI, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
  });
  logger.info('MongoDB connected');
};
