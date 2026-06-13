import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logger from '../config/logger';
import { AppError } from '../utils/errors';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Log error using Winston
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: (req as any).user ? (req as any).user._id : 'Anonymous'
  });

  // Default values
  let statusCode = 500;
  let errorName = 'InternalServerError';
  let message = 'An unexpected error occurred';
  let details: any = undefined;

  // Handle custom AppErrors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorName = error.name || 'AppError';
    message = error.message;
    if ((error as any).details) {
      details = (error as any).details;
    }
  } 
  // Handle Mongoose Validation Errors
  else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    errorName = 'ValidationError';
    message = 'Invalid input data provided';
    details = Object.values(error.errors).map(err => err.message);
  } 
  // Handle Mongoose Duplicate Key Error
  else if ((error as any).code === 11000) {
    statusCode = 409;
    errorName = 'ConflictError';
    const field = Object.keys((error as any).keyPattern || {})[0] || 'Field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } 
  // Handle Mongoose CastError (Invalid ID format)
  else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    errorName = 'CastError';
    message = `Invalid ${error.path}: ${error.value}`;
  } 
  // Handle JWT Error
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorName = 'JsonWebTokenError';
    message = 'Authentication token is invalid';
  } 
  // Handle Token Expired
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    errorName = 'TokenExpiredError';
    message = 'Authentication token has expired';
  }
  // Handle Multer Errors
  else if (error.name === 'MulterError') {
    statusCode = 400;
    errorName = 'MulterError';
    message = error.message;
  }

  // Response payload
  const responsePayload = {
    error: errorName,
    message,
    ...(details && { details }),
    ...(!isProduction && { stack: error.stack }),
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(responsePayload);
};