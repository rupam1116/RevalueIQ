import mongoose from 'mongoose';
import logger from '../logs/logger';

export class DatabaseService {
  async getStatus(): Promise<{ status: string; connected: boolean }> {
    const state = mongoose.connection.readyState;
    let statusText = 'disconnected';
    
    switch (state) {
      case 0:
        statusText = 'disconnected';
        break;
      case 1:
        statusText = 'connected';
        break;
      case 2:
        statusText = 'connecting';
        break;
      case 3:
        statusText = 'disconnecting';
        break;
    }

    return {
      status: statusText,
      connected: state === 1,
    };
  }
}

export const databaseService = new DatabaseService();
