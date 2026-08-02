import { userRepository } from '../repositories/user.repository';
import logger from '../logs/logger';
import { IUser } from '../models/User';

export class UserService {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existing = await userRepository.findByFirebaseUid(userData.firebaseUid as string);
    if (existing) {
      throw new Error('User already exists');
    }
    return await userRepository.create(userData);
  }

  async getUserById(firebaseUid: string): Promise<IUser | null> {
    return await userRepository.findByFirebaseUid(firebaseUid);
  }

  async softDeleteUser(firebaseUid: string): Promise<IUser | null> {
    const user = await userRepository.delete(firebaseUid);
    if (!user) throw new Error('User not found');
    logger.info(`User ${firebaseUid} softly deleted (status: deleted)`);
    return user;
  }
}

export const userService = new UserService();
