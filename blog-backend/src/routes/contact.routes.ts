import { Router, Request, Response, NextFunction } from 'express';
import { validateRequest, contactFormSchema } from '../validators/schema.validator';
import { contactLimiter } from '../middleware/rateLimit.middleware';
import EmailService from '../services/email.service';
import env from '../config/env';

const router = Router();

router.post(
  '/',
  contactLimiter,
  validateRequest({ body: contactFormSchema }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, subject, message } = req.body;

      const emailService = new EmailService();
      
      const adminEmail = env.ADMIN_EMAIL || 'admin@blog.com';
      const contactTemplate = {
        subject: `[Contact Form] ${subject}`,
        html: `
          <h2>New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line; background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${message}</p>
        `,
        text: `
          New Contact Form Message
          Name: ${name}
          Email: ${email}
          Subject: ${subject}
          Message:
          ${message}
        `
      };

      await emailService.sendEmail(adminEmail, contactTemplate);

      res.json({
        success: true,
        message: 'Your message has been received. Thank you!'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
