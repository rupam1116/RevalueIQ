import { Request, Response, NextFunction } from 'express';

export const subscribeNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Phase 1: Mock success response to preserve UI behavior
    res.status(200).json({ success: true, message: "Subscribed successfully (Mock Phase 1)." });
  } catch (error) {
    next(error);
  }
};

export const getRealtimeBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ articles: [] });
  } catch (error) {
    next(error);
  }
};

