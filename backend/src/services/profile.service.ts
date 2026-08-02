import { userRepository } from '../repositories/user.repository';
import { appraisalRepository } from '../repositories/appraisal.repository';
import logger from '../logs/logger';

export class ProfileService {
  async getProfile(firebaseUid: string) {
    const user = await userRepository.findByFirebaseUid(firebaseUid);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(firebaseUid: string, data: any) {
    const user = await userRepository.update(firebaseUid, data);
    if (!user) throw new Error('User not found');
    return user;
  }

  // existing appraisal mock code omitted for brevity but preserved below
  async getUserAppraisals(userId: string) {
    try {
      return await appraisalRepository.findByUserId(userId);
    } catch (err) {
      logger.warn('Failed to fetch from DB (likely disconnected). Returning memory mock.');
      return [
        {
          id: "mock-id-12345",
          deviceName: "Apple iPhone 13 Pro",
          category: "Smartphone",
          condition: "Good",
          conditionDetails: "Minor scratches.",
          estimatedValue: 35000,
          lowEstimate: 30000,
          highEstimate: 40000,
          recommendation: "Sell",
          createdAt: new Date(),
        }
      ];
    }
  }

  async getAppraisalDetails(id: string) {
    try {
      const data = await appraisalRepository.findById(id);
      if (!data) throw new Error('Not found');
      return data;
    } catch (err) {
      logger.warn('Failed to fetch from DB (likely disconnected). Returning memory mock.');
      return {
        id,
        deviceName: "Apple iPhone 13 Pro",
        category: "Smartphone",
        condition: "Good",
        conditionDetails: "Minor scratches.",
        estimatedValue: 35000,
        lowEstimate: 30000,
        highEstimate: 40000,
        recommendation: "Sell",
        createdAt: new Date(),
        imageUrl: "https://via.placeholder.com/300",
      };
    }
  }
}

export const profileService = new ProfileService();
