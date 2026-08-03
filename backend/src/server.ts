import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';
import { connectDB } from './config/database';
import logger from './logs/logger';

const PORT = process.env.PORT || 5000;

// Start listening immediately to prevent Render timeout
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Connect to MongoDB asynchronously without blocking
connectDB().catch(error => {
  logger.error('Failed to connect to MongoDB during startup:', error);
});

// Graceful Shutdown
const shutdown = () => {
  logger.info('SIGTERM/SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    // If mongoose is connected, close it too
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close(false).then(() => {
        logger.info('MongoDB connection closed.');
        process.exit(0);
      }).catch((err) => {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
      });
    } else {
      process.exit(0);
    }
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
