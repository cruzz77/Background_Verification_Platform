import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.url} - Status ${statusCode} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  // Handle Prisma unique constraint failed
  if (err.message && err.message.includes('Unique constraint failed')) {
    return res.status(409).json({
      status: 'error',
      message: 'A record with these details already exists.',
    });
  }

  return res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
