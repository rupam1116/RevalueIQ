import { Request, Response, NextFunction } from 'express';

// Middleware to check roles. Assumes verifyToken middleware has run and populated req.user.
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // In a real application, you would either set custom claims on the Firebase token
    // or fetch the user role from MongoDB here.
    // For Phase 2, we assume 'user' is the default if not set.
    const userRole = req.user?.role || 'user'; 

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient privileges',
      });
    }

    next();
  };
};
