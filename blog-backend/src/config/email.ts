import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  from: process.env.SMTP_FROM || 'noreply@yourblog.com'
};

export const notificationEmails = {
  admin: process.env.ADMIN_EMAIL || '',
  support: process.env.SUPPORT_EMAIL || ''
};