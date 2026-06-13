import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import env from '../config/env';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'AuthenticationRequired', message: 'No authorization token provided' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        res.status(401).json({ error: 'UserNotFound', message: 'User associated with this token no longer exists' });
        return;
      }

      req.user = user;
      next();
    } catch (jwtError: any) {
      if (jwtError.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'TokenExpiredError', message: 'Authentication token has expired' });
        return;
      }
      res.status(401).json({ error: 'InvalidToken', message: 'Authentication token is invalid' });
      return;
    }
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'AccessDenied', message: 'You do not have permission to perform this action' });
      return;
    }
    next();
  };
};