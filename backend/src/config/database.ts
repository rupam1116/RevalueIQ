import mongoose from 'mongoose';
import logger from '../logs/logger';

const MAX_RETRIES = 5;
let retryCount = 0;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    logger.error('MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  const attemptConnection = async () => {
    try {
      const conn = await mongoose.connect(uri);
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      retryCount++;
      logger.error(`Error connecting to MongoDB (Attempt ${retryCount}/${MAX_RETRIES}):`, error);
      
      if (retryCount >= MAX_RETRIES) {
        logger.error('Max connection retries reached. Exiting...');
        process.exit(1);
      }
      
      setTimeout(attemptConnection, 5000);
    }
  };

  await attemptConnection();
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
