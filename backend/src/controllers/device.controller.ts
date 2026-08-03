import { Request, Response, NextFunction } from 'express';
import { deviceService } from '../services/device.service';

export const analyzeDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is provided by Firebase Auth middleware verifyToken() if enabled
    const userId = req.user?.uid || "guest-mobile-user";

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    // Controller remains thin. Delegates logic to Service.
    const result = await deviceService.analyzeDevice(userId, req.file);
    
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
