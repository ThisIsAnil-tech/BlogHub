import { Request, Response, NextFunction } from 'express';
import ParentBlog from '../models/ParentBlog';
import ChildBlog from '../models/ChildBlog';
import env from '../config/env';

export const SeoController = {
  async getSitemap(_req: Request, res: Response, next: NextFunction) {
    try {
      const frontendUrl = env.FRONTEND_URL.replace(/\/$/, '');

      // Get all published parent blogs
      const parentBlogs = await ParentBlog.find({ isPublished: true }).select('slug updatedAt').lean();
      
      // Get all published child blogs
      const childBlogs = await ChildBlog.find({ isPublished: true }).select('slug updatedAt').lean();

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // 1. Static Pages
      const staticPages = [
        { path: '', changefreq: 'daily', priority: '1.0' },
        { path: '/blogs', changefreq: 'daily', priority: '0.9' },
        { path: '/about', changefreq: 'monthly', priority: '0.7' },
        { path: '/contact', changefreq: 'monthly', priority: '0.7' },
        { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
        { path: '/terms', changefreq: 'yearly', priority: '0.3' },
        { path: '/cookie-policy', changefreq: 'yearly', priority: '0.3' },
        { path: '/tags', changefreq: 'weekly', priority: '0.5' }
      ];

      for (const page of staticPages) {
        xml += '  <url>\n';
        xml += `    <loc>${frontendUrl}${page.path}</loc>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
      }

      // 2. Parent Blogs
      for (const blog of parentBlogs) {
        xml += '  <url>\n';
        xml += `    <loc>${frontendUrl}/blogs/${blog.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(blog.updatedAt).toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      }

      // 3. Child Blogs
      for (const blog of childBlogs) {
        xml += '  <url>\n';
        xml += `    <loc>${frontendUrl}/blog/${blog.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(blog.updatedAt).toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      }

      xml += '</urlset>\n';

      res.header('Content-Type', 'application/xml');
      res.status(200).send(xml);
    } catch (error) {
      next(error);
    }
  },

  async getRobotsTxt(_req: Request, res: Response) {
    const frontendUrl = env.FRONTEND_URL.replace(/\/$/, '');
    const robots = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin/',
      'Disallow: /api/',
      '',
      `Sitemap: ${frontendUrl}/sitemap.xml`
    ].join('\n');

    res.header('Content-Type', 'text/plain');
    res.status(200).send(robots);
  }
};
