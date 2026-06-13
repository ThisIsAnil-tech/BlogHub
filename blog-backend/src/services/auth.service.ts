import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import Session from '../models/Session';
import { AppError, AuthenticationError, ValidationError, NotFoundError } from '../utils/errors';
import env from '../config/env';
import EmailService from './email.service';

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export class AuthService {
  private static getJwtSecret(): string {
    return env.JWT_SECRET;
  }

  static generateAccessToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id, role: user.role },
      this.getJwtSecret(),
      { expiresIn: env.JWT_EXPIRE as any }
    );
  }

  static async generateSession(user: IUser, ipAddress: string, userAgent: string) {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = hashToken(refreshToken);
    
    const expiresAt = new Date();
    const days = parseInt(env.JWT_REFRESH_EXPIRE.replace('d', '')) || 7;
    expiresAt.setDate(expiresAt.getDate() + days);

    await Session.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      userAgent,
      ipAddress
    });

    return refreshToken;
  }

  static async register(reqBody: any, ip: string = '', ua: string = '') {
    const { username, email, password } = reqBody;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new ValidationError('User with this email or username already exists');
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'viewer';

    const user = await User.create({
      username,
      email,
      password,
      role
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateSession(user, ip, ua);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken
    };
  }

  static async login(reqBody: any, ip: string = '', ua: string = '') {
    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateSession(user, ip, ua);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken
    };
  }

  static async refresh(oldRefreshToken: string, ip: string = '', ua: string = '') {
    const tokenHash = hashToken(oldRefreshToken);
    const session = await Session.findOne({ tokenHash });

    if (!session) {
      throw new AuthenticationError('Invalid refresh token');
    }

    if (session.revoked) {
      await Session.deleteMany({ userId: session.userId });
      throw new AuthenticationError('Token reuse detected. All sessions revoked.');
    }

    if (session.expiresAt < new Date()) {
      await session.deleteOne();
      throw new AuthenticationError('Refresh token expired');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await session.deleteOne();

    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateSession(user, ip, ua);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  static async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    await Session.deleteOne({ tokenHash });
  }

  static async forcedLogout(userId: string) {
    await Session.deleteMany({ userId });
  }

  static async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  static async updateProfile(userId: string, data: any) {
    const { username, email, bio, profileImage, socialLinks } = data;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ValidationError('Email already in use');
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new ValidationError('Username already in use');
      }
      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;

    await user.save();
    return user.toJSON();
  }

  static async changePassword(userId: string, data: any) {
    const { currentPassword, newPassword } = data;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      throw new ValidationError('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    await this.forcedLogout(userId);
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 3600000);

    await user.save();

    const emailService = new EmailService();
    const template = emailService.getResetPasswordTemplate(resetToken);
    await emailService.sendEmail(user.email, template);
  }

  static async resetPassword(token: string, data: any) {
    const { password } = data;
    const tokenHash = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new ValidationError('Password reset token is invalid or has expired');
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    await this.forcedLogout(user._id.toString());
  }
}
