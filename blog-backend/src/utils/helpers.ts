import crypto from 'crypto';

// Generate slug from string
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Generate excerpt from content
export const generateExcerpt = (content: string, length: number = 200): string => {
  const strippedContent = content.replace(/<[^>]+>/g, '');
  return strippedContent.length > length 
    ? strippedContent.substring(0, length) + '...' 
    : strippedContent;
};

// Calculate read time
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Sanitize HTML
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  // 1. Remove script blocks entirely
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 2. Remove other dangerous tags (iframe, embed, object, style, link, meta, svg, forms, etc.)
  clean = clean.replace(/<(iframe|embed|object|style|link|meta|svg|form|input|button|textarea)\b[^>]*>([\s\S]*?)<\/\1>/gi, '');
  clean = clean.replace(/<(iframe|embed|object|style|link|meta|svg|form|input|button|textarea)\b[^>]*>/gi, '');
  
  // 3. Remove inline event handlers (onload, onerror, onclick, etc.)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  
  // 4. Remove javascript:, data:, and vbscript: URIs in src, href, etc.
  clean = clean.replace(/(href|src|xlink:href)\s*=\s*["']?\s*(javascript|data|vbscript):[^"'>]*["']?/gi, '$1="#"');
  
  return clean;
};

// Generate random string
export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Format date
export const formatDate = (date: Date, format: string = 'en-US'): string => {
  return new Date(date).toLocaleDateString(format, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Parse query parameters
export const parseQueryParams = (query: any) => {
  const params: any = {};
  
  if (query.page) params.page = parseInt(query.page);
  if (query.limit) params.limit = parseInt(query.limit);
  if (query.sort) params.sort = query.sort;
  if (query.order) params.order = query.order;
  if (query.search) params.search = query.search;
  if (query.tags) params.tags = Array.isArray(query.tags) ? query.tags : [query.tags];
  
  return params;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate password hash
export const generatePasswordHash = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
};