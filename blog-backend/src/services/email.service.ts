import nodemailer from 'nodemailer';
import { EmailTemplate } from '../types';
import env from '../config/env';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
      }
    });
  }

  async sendEmail(to: string, template: EmailTemplate) {
    try {
      // If we are in dev and have no credentials, just log the email and return success
      if (env.NODE_ENV !== 'production' && (!env.SMTP_USER || !env.SMTP_PASSWORD)) {
        console.log(`✉️ [Dev Email Logger] To: ${to}`);
        console.log(`✉️ Subject: ${template.subject}`);
        console.log(`✉️ Text: ${template.text}`);
        return true;
      }

      await this.transporter.sendMail({
        from: env.SMTP_FROM || 'noreply@yourblog.com',
        to,
        subject: template.subject,
        html: template.html,
        text: template.text
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  getNewCommentTemplate(comment: any, blog: any): EmailTemplate {
    return {
      subject: `New Comment on "${blog.title}"`,
      html: `
        <h2>New Comment</h2>
        <p><strong>Name:</strong> ${comment.name}</p>
        <p><strong>Email:</strong> ${comment.email}</p>
        <p><strong>Comment:</strong> ${comment.content}</p>
        <p><strong>Blog:</strong> ${blog.title}</p>
        <p><a href="${env.FRONTEND_URL}/admin/comments">Manage Comments</a></p>
      `,
      text: `
        New Comment
        Name: ${comment.name}
        Email: ${comment.email}
        Comment: ${comment.content}
        Blog: ${blog.title}
        Manage Comments: ${env.FRONTEND_URL}/admin/comments
      `
    };
  }

  getBlogPublishedTemplate(blog: any, author: any): EmailTemplate {
    return {
      subject: `Blog Published: "${blog.title}"`,
      html: `
        <h2>Blog Published Successfully</h2>
        <p>Your blog post "${blog.title}" has been published.</p>
        <p><strong>URL:</strong> ${env.FRONTEND_URL}/blog/${blog.slug}</p>
        <p><strong>Published at:</strong> ${new Date(blog.publishedAt).toLocaleString()}</p>
      `,
      text: `
        Blog Published Successfully
        Your blog post "${blog.title}" has been published.
        URL: ${env.FRONTEND_URL}/blog/${blog.slug}
        Published at: ${new Date(blog.publishedAt).toLocaleString()}
      `
    };
  }

  getResetPasswordTemplate(token: string): EmailTemplate {
    const resetUrl = `${env.FRONTEND_URL}/admin/reset-password?token=${token}`;
    return {
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
        <p>This link is valid for 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
      text: `
        Password Reset Request
        You requested a password reset. Please go to the following link to reset your password:
        ${resetUrl}
        This link is valid for 1 hour.
        If you did not request this, please ignore this email.
      `
    };
  }
}
export default EmailService;