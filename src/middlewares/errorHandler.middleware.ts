import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

