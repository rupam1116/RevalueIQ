import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';
import { connectDB } from './config/database';
import logger from './logs/logger';

const PORT = parseInt(process.env.PORT || "5000", 10);

logger.info(`PORT environment variable = ${process.env.PORT}`);
logger.info(`Using PORT = ${PORT}`);

if (Number.isNaN(PORT)) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

// Start listening immediately to prevent Render timeout
const server = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server listening on port ${PORT}`);
});

logger.info("Connecting to MongoDB...");
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
