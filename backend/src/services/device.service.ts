import { appraisalRepository } from '../repositories/appraisal.repository';
import { uploadService } from './upload.service';
import { aiService } from './ai.service';
import logger from '../logs/logger';

export class DeviceService {
  async analyzeDevice(userId: string, file: Express.Multer.File) {
    logger.info(`Analyzing device for user: ${userId}`);
    
    try {
      // 1. Upload to Cloudinary (or run in parallel with AI analysis)
      logger.info('Uploading image to Cloudinary...');
      const imageUrl = await uploadService.uploadImage(file.buffer);

      // 2. Analyze with Gemini
      logger.info('Analyzing image with Gemini...');
      const aiData = await aiService.analyzeDeviceImage(file.buffer, file.mimetype);

      // 3. Save to DB
      logger.info('Saving appraisal to DB...');
      const saved = await appraisalRepository.create({
        ...aiData,
        imageUrl,
        userId: userId || "guest-mobile-user"
      });

      return saved;
    } catch (err: any) {
      logger.error('Failed during device analysis:', err);
      throw new Error(`Device analysis failed: ${err.message}`);
    }
  }
}

export const deviceService = new DeviceService();
