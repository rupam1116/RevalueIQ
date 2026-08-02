import { userRepository } from '../repositories/user.repository';
import logger from '../logs/logger';

export class AuthService {
  async syncUser(
    firebaseUid: string, 
    email: string | undefined, 
    isEmailVerified: boolean,
    details: { fullName?: string; phoneNumber?: string; provider?: string }
  ) {
    try {
      let user = await userRepository.findByFirebaseUid(firebaseUid);

      if (user) {
        // Update last login and potentially verification status
        user = await userRepository.update(firebaseUid, {
          lastLogin: new Date(),
          isEmailVerified,
          ...(details.fullName && { fullName: details.fullName }),
          ...(details.phoneNumber && { phoneNumber: details.phoneNumber }),
          ...(details.provider && { provider: details.provider as any }),
        });
      } else {
        // Create new user
        if (!email) throw new Error("Email is required for new users");
        
        user = await userRepository.create({
          firebaseUid,
          email,
          fullName: details.fullName || "User",
          phoneNumber: details.phoneNumber,
          isEmailVerified,
          provider: (details.provider as any) || 'unknown',
          lastLogin: new Date(),
        });
      }
      return user;
    } catch (err) {
      logger.error(`Error syncing user ${firebaseUid}: ${err}`);
      throw err;
    }
  }
}

export const authService = new AuthService();
