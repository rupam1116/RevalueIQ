import { z } from 'zod';

export const createUserSchema = z.object({
  firebaseUid: z.string().min(1, 'Firebase UID is required'),
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format').optional(),
  provider: z.enum(['email', 'google', 'unknown']).default('email'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format').optional(),
  preferences: z.object({
    notifications: z.boolean().optional(),
    newsletter: z.boolean().optional(),
  }).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
