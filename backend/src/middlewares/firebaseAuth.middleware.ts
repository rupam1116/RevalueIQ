import { Request, Response, NextFunction } from 'express';
import { firebaseAdminAuth } from '../config/firebase';
import { DecodedIdToken } from 'firebase-admin/auth';
import logger from '../logs/logger';

// Extends Express Request to hold the decoded Firebase user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized request - No token provided');
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    logger.error(`Unauthorized request - Invalid token: ${error}`);
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};
