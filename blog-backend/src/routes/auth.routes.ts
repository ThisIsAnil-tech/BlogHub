import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  validateRequest,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  tokenParamSchema,
  userIdParamSchema
} from '../validators/schema.validator';

const router = Router();

// Public routes
router.post('/register', validateRequest({ body: registerSchema }), AuthController.register);
router.post('/login', validateRequest({ body: loginSchema }), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', validateRequest({ body: forgotPasswordSchema }), AuthController.forgotPassword);
router.post('/reset-password/:token', validateRequest({ params: tokenParamSchema, body: resetPasswordSchema }), AuthController.resetPassword);

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser);
router.put('/profile', authenticate, validateRequest({ body: updateProfileSchema }), AuthController.updateProfile);
router.put('/change-password', authenticate, validateRequest({ body: changePasswordSchema }), AuthController.changePassword);
router.post('/logout', authenticate, AuthController.logout);

// Admin-only routes
router.post('/forced-logout/:userId', authenticate, authorize('admin'), validateRequest({ params: userIdParamSchema }), AuthController.forcedLogout);

export default router;