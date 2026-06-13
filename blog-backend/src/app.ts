import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import i18nextBackend from 'i18next-fs-backend';
import path from 'path';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';

import authRoutes from './routes/auth.routes';
import parentBlogRoutes from './routes/parentBlog.routes';
import childBlogRoutes from './routes/childBlog.routes';
import commentRoutes from './routes/comment.routes';
import tagRoutes from './routes/tag.routes';
import analyticsRoutes from './routes/analytics.routes';
import notificationRoutes from './routes/notification.routes';
import imageRoutes from './routes/image.routes';
import contactRoutes from './routes/contact.routes';
import { errorMiddleware } from './middleware/error.middleware';
import { authLimiter, commentLimiter, apiLimiter } from './middleware/rateLimit.middleware';
import { SeoController } from './controllers/seo.controller';

dotenv.config();

// Initialize i18n
i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json')
    },
    preload: ['en', 'es', 'fr', 'de'],
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'x-language'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
  maxAge: 86400
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(i18nextMiddleware.handle(i18next));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/comments', commentLimiter);
app.use('/api', apiLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.jpeg')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// API Documentation
app.get('/api-docs', (_req, res) => {
  res.json({
    message: 'API Documentation',
    endpoints: {
      auth: '/api/auth',
      parentBlogs: '/api/parent-blogs',
      childBlogs: '/api/child-blogs',
      comments: '/api/comments',
      tags: '/api/tags',
      analytics: '/api/analytics',
      notifications: '/api/notifications'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parent-blogs', parentBlogRoutes);
app.use('/api/child-blogs', childBlogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/contact', contactRoutes);

// SEO files
app.get('/sitemap.xml', SeoController.getSitemap);
app.get('/robots.txt', SeoController.getRobotsTxt);

// Health & readiness check
app.get('/health', async (_req, res) => {
  const mongoose = await import('mongoose');
  const isDbUp = mongoose.connection.readyState === 1;
  const dbStatus = isDbUp ? 'UP' : 'DOWN';
  const statusCode = isDbUp ? 200 : 503;

  res.status(statusCode).json({
    status: isDbUp ? 'OK' : 'ERROR',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: dbStatus
    },
    metrics: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      pid: process.pid
    }
  });
});

app.get('/api/status', (_req, res) => {
  res.json({
    api: 'Blog API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    features: [
      'Authentication',
      'Parent/Child Blog Management',
      'Comment System',
      'Tag Management',
      'Analytics',
      'Notifications',
      'Multi-language Support',
      'Search Functionality'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date()
  });
});

// Error handler
app.use(errorMiddleware);

export default app;