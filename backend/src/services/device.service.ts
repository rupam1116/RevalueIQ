import { appraisalRepository } from '../repositories/appraisal.repository';
import logger from '../logs/logger';

export class DeviceService {
  async analyzeDeviceMock(userId: string) {
    logger.info(`Analyzing device for user: ${userId}`);
    
    // Phase 1 Mock Logic
    const mockData = {
      deviceName: "Apple iPhone 13 Pro (Mock)",
      category: "Smartphone",
      condition: "Good",
      conditionDetails: "Minor scratches on back panel. Screen is flawless.",
      estimatedValue: 35000,
      lowEstimate: 30000,
      highEstimate: 40000,
      recommendation: "Sell",
      recommendationReason: "The device retains high resale value in the current market.",
      imageUrl: "https://via.placeholder.com/300?text=Mock+Image",
    };

    // Save mock to DB using repository (will fail if MongoDB is not connected, but we can catch it or return early)
    // For now, we'll just return the mock data to simulate processing without actually writing to DB during Phase 1 if DB is disconnected.
    try {
      const saved = await appraisalRepository.create({
        ...mockData,
        userId: userId || "guest-mobile-user"
      });
      return saved;
    } catch (err) {
      logger.warn('Failed to save to DB (likely disconnected). Returning memory mock.');
      return { ...mockData, id: "mock-id-12345" };
    }
  }
}

export const deviceService = new DeviceService();
