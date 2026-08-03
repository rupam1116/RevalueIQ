import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import logger from '../logs/logger';

// Configure cloudinary (ensure CLOUDINARY_URL or api key/secret are in .env)
// It automatically picks up CLOUDINARY_URL from env if set.

export class UploadService {
  /**
   * Uploads a file buffer to Cloudinary
   * @param fileBuffer The file buffer from multer
   * @param folder The folder name in cloudinary
   * @returns The secure URL of the uploaded image
   */
  async uploadImage(fileBuffer: Buffer, folder: string = 'revalueiq_appraisals'): Promise<string> {
    if (!process.env.CLOUDINARY_URL) {
      throw new Error('CLOUDINARY_URL is not configured');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary upload failed: ${error.message}`);
            return reject(error);
          }
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Cloudinary upload failed: No secure_url in result'));
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }
}

export const uploadService = new UploadService();
