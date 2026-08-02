import { Request, Response, NextFunction } from 'express';
import { deviceService } from '../services/device.service';

export const analyzeDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.auth is provided by Clerk middleware verifyToken() if we enable it
    // Using a fallback for Phase 1 if token is not passed from frontend yet
    const userId = (req as any).auth?.userId || "guest-mobile-user";

    // Controller remains thin. Delegates logic to Service.
    const result = await deviceService.analyzeDeviceMock(userId);
    
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
