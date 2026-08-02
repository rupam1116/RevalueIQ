import { z } from 'zod';

export const analyzeDeviceSchema = z.object({
  body: z.object({
    // Form data fields can be validated here
    // Example: category: z.string().optional()
  }),
  // For file uploads, we usually validate the file object separately, but Zod can validate other req properties
});
