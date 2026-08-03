import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';
import logger from './logs/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    try {
      await connectDB();
    } catch (dbError) {
      logger.warn('Skipping MongoDB connection for Phase 1 as no URI was provided.');
    }
    
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      logger.info('SIGTERM/SIGINT received. Shutting down gracefully...');
      server.close(() => {
        logger.info('HTTP server closed.');
        // If mongoose is connected, close it too
        // mongoose.connection.close(false, () => {
        //   logger.info('MongoDB connection closed.');
        process.exit(0);
        // });
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
