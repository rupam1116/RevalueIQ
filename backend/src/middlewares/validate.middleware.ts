import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import logger from '../logs/logger';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          details: error.errors,
        });
      }
      return next(error);
    }
  };
};
