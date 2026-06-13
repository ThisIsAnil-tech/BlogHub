export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  profileImage?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentBlog {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  children?: ChildBlog[];
  tags?: Tag[];
}

export interface ChildBlog {
  id: string;
  parentId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished: boolean;
  views: number;
  readTime: number;
  authorId: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  parent?: ParentBlog;
  author?: User;
  comments?: Comment[];
  tags?: Tag[];
  relatedPosts?: ChildBlog[];
}

export interface Comment {
  id: string;
  blogId: string;
  parentId?: string;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  blog?: ChildBlog;
  replies?: Comment[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  blogs?: ChildBlog[];
}

export interface BlogTag {
  id: string;
  blogId: string;
  tagId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogView {
  id: string;
  blogId: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  referrer?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'new_comment' | 'blog_published' | 'system';
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsData {
  totalViews: number;
  totalBlogs: number;
  totalComments: number;
  viewsByDate: Array<{ date: string; count: number }>;
  popularBlogs: ChildBlog[];
  trafficSources: Array<{ source: string; count: number }>;
  countryStats: Array<{ country: string; count: number }>;
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  authorId?: string;
  parentId?: string;
  publishedOnly?: boolean;
  sortBy?: 'date' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}