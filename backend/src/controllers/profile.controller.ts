import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const firebaseUid = req.user?.uid;
    if (!firebaseUid) return res.status(401).json({ error: 'Unauthorized' });
    
    const profile = await profileService.getProfile(firebaseUid);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const firebaseUid = req.user?.uid;
    if (!firebaseUid) return res.status(401).json({ error: 'Unauthorized' });
    
    const profile = await profileService.updateProfile(firebaseUid, req.body);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const getAppraisals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).auth?.userId || "guest-mobile-user";
    const data = await profileService.getUserAppraisals(userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAppraisalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await profileService.getAppraisalDetails(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
