import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../logs/logger';

export class AiService {
  /**
   * Analyzes an image of an electronic device and returns appraisal data
   * @param imageBuffer The file buffer of the image
   * @param mimeType The mime type of the image (e.g., 'image/jpeg')
   */
  async analyzeDeviceImage(imageBuffer: Buffer, mimeType: string) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    try {
      // Initialize Gemini only when called
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const prompt = `
        You are an expert electronics appraiser. Analyze this image of a device.
        Provide your assessment in strict JSON format with the following keys:
        - "deviceName": The make and model of the device (e.g., "Apple iPhone 13 Pro").
        - "category": The general category (e.g., "Smartphone", "Laptop", "Tablet").
        - "condition": A single word describing condition: "Excellent", "Good", "Fair", or "Poor".
        - "conditionDetails": A brief sentence explaining why you chose that condition based on visible damage.
        - "estimatedValue": A single integer representing the estimated value in Indian Rupees (INR).
        - "lowEstimate": A single integer representing the low end of the value range in INR.
        - "highEstimate": A single integer representing the high end of the value range in INR.
        - "recommendation": A single word: "Sell", "Repair", or "Recycle".
        - "recommendationReason": A brief sentence explaining the recommendation.
        
        Ensure the output is ONLY raw JSON, with no markdown formatting or backticks.
      `;

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Clean up the text if it contains markdown JSON blocks
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      return JSON.parse(cleanText);
    } catch (error) {
      logger.error('Error analyzing image with Gemini:', error);
      throw new Error('AI analysis failed');
    }
  }
}

export const aiService = new AiService();
