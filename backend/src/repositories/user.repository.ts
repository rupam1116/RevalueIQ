import User, { IUser } from '../models/User';

export class UserRepository {
  async findByFirebaseUid(firebaseUid: string): Promise<IUser | null> {
    return await User.findOne({ firebaseUid, status: { $ne: 'deleted' } });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email, status: { $ne: 'deleted' } });
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async update(firebaseUid: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { firebaseUid, status: { $ne: 'deleted' } },
      updateData,
      { new: true }
    );
  }

  async delete(firebaseUid: string): Promise<IUser | null> {
    // Soft Delete
    return await User.findOneAndUpdate(
      { firebaseUid },
      { status: 'deleted' },
      { new: true }
    );
  }
}

export const userRepository = new UserRepository();
