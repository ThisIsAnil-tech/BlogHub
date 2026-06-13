import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import env from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || '';
      const ua = req.headers['user-agent'] || '';
      const { user, accessToken, refreshToken } = await AuthService.register(req.body, ip, ua);
      
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.status(201).json({ user, accessToken });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || '';
      const ua = req.headers['user-agent'] || '';
      const { user, accessToken, refreshToken } = await AuthService.login(req.body, ip, ua);
      
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.json({ user, accessToken });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;
      if (!oldRefreshToken) {
        res.status(401).json({ error: 'Refresh token missing' });
        return;
      }

      const ip = req.ip || '';
      const ua = req.headers['user-agent'] || '';
      const { user, accessToken, refreshToken } = await AuthService.refresh(oldRefreshToken, ip, ua);

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.json({ user, accessToken });
    } catch (error) {
      // Clear cookie if refresh fails
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      next(error);
    }
  },

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const user = await AuthService.getCurrentUser(userId.toString());
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const updatedUser = await AuthService.updateProfile(userId.toString(), req.body);
      res.json({ user: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      await AuthService.changePassword(userId.toString(), req.body);
      
      // Clear refresh token cookie since all sessions are revoked on password change
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
    } catch (error) {
      // ignore logout service failure, proceed to clear cookie
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      // Return success even if email doesn't exist for security
      res.json({ message: 'If a matching account exists, a password reset link has been sent to your email.' });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      await AuthService.resetPassword(token, req.body);
      res.json({ message: 'Password has been reset successfully. Please log in again.' });
    } catch (error) {
      next(error);
    }
  },

  async forcedLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      await AuthService.forcedLogout(userId);
      res.json({ message: `Forced logout complete. All active sessions for user ${userId} have been terminated.` });
    } catch (error) {
      next(error);
    }
  }
};