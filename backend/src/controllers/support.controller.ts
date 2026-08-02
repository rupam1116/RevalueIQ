import { Request, Response, NextFunction } from 'express';

export const submitContactForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, message: "Contact form submitted (Mock Phase 1)." });
  } catch (error) {
    next(error);
  }
};
