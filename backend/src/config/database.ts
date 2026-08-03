import mongoose from 'mongoose';
import logger from '../logs/logger';

const MAX_RETRIES = 5;
let retryCount = 0;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    logger.error('MONGODB_URI is not defined in environment variables.');
    return Promise.reject(new Error('MONGODB_URI is not defined in environment variables.'));
  }

  return new Promise<void>((resolve, reject) => {
    const attemptConnection = async () => {
      try {
        const conn = await mongoose.connect(uri);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        resolve();
      } catch (error) {
        retryCount++;
        logger.error(`Error connecting to MongoDB (Attempt ${retryCount}):`, error);
        
        // Retry indefinitely in the background
        setTimeout(attemptConnection, 5000);
      }
    };

    attemptConnection();
  });
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});
