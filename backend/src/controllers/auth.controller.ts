import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const syncUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const firebaseUid = req.user?.uid;
    const email = req.user?.email;
    const isEmailVerified = req.user?.email_verified || false;

    if (!firebaseUid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { fullName, phoneNumber, provider } = req.body;

    const user = await authService.syncUser(firebaseUid, email, isEmailVerified, {
      fullName,
      phoneNumber,
      provider
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If we managed server-side sessions or refresh tokens, we would revoke them here.
    // For now, Firebase handles client-side revocation.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
