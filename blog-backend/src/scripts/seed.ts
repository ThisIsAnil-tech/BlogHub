import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import ParentBlog from '../models/ParentBlog';
import ChildBlog from '../models/ChildBlog';
import Tag from '../models/Tag';
import Comment from '../models/Comment';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ParentBlog.deleteMany({});
    await ChildBlog.deleteMany({});
    await Tag.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      username: 'admin',
      email: 'admin@blog.com',
      password: 'Admin@123',
      role: 'admin',
      bio: 'System administrator',
      socialLinks: {}
    });
    console.log('Admin user created');

    // Create Tags
    const tags = await Tag.insertMany([
      { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
      { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
      { name: 'React', slug: 'react', color: '#61DAFB' },
      { name: 'Node.js', slug: 'nodejs', color: '#339933' },
      { name: 'Python', slug: 'python', color: '#3776AB' },
      { name: 'Web Development', slug: 'webdev', color: '#EAD6CE' },
      { name: 'Tutorial', slug: 'tutorial', color: '#FCE5C0' }
    ]);
    console.log(`Created ${tags.length} tags`);

    // Create Parent Blogs
    const parentBlogs = await ParentBlog.insertMany([
      {
        title: 'Technology',
        slug: 'technology',
        description: 'Latest tech news, trends, and insights',
        order: 1,
        isPublished: true,
        authorId: admin._id,
        tags: [tags[0]._id, tags[1]._id, tags[2]._id]
      },
      {
        title: 'Programming',
        slug: 'programming',
        description: 'Programming guides, tutorials, and best practices',
        order: 2,
        isPublished: true,
        authorId: admin._id,
        tags: [tags[0]._id, tags[1]._id, tags[2]._id, tags[3]._id]
      },
      {
        title: 'Web Development',
        slug: 'web-development',
        description: 'Frontend and backend web development',
        order: 3,
        isPublished: true,
        authorId: admin._id,
        tags: [tags[2]._id, tags[3]._id, tags[5]._id]
      }
    ]);
    console.log(`Created ${parentBlogs.length} parent blogs`);

    // Create Sample Child Blogs
    const sampleContent = `
# Getting Started with TypeScript

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.

## Why TypeScript?

1. **Static Typing**: Catch errors at compile time
2. **Better IDE Support**: Autocomplete and refactoring
3. **Modern JavaScript Features**: Use latest ECMAScript features
4. **Scalability**: Better for large applications

## Basic Types Example

\`\`\`typescript
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
\`\`\`

## Conclusion

TypeScript is a powerful tool that enhances JavaScript development.
    `;

    const childBlogs = await ChildBlog.insertMany([
      {
        parentId: parentBlogs[0]._id,
        title: 'The Future of AI in 2024',
        slug: 'future-of-ai-2024',
        content: sampleContent,
        excerpt: 'Exploring the latest trends in artificial intelligence and machine learning',
        featuredImage: 'https://picsum.photos/seed/ai/800/400',
        isPublished: true,
        views: 1250,
        readTime: 5,
        authorId: admin._id,
        publishedAt: new Date(),
        tags: [tags[0]._id, tags[1]._id]
      },
      {
        parentId: parentBlogs[1]._id,
        title: 'React 19: What\'s New?',
        slug: 'react-19-whats-new',
        content: sampleContent,
        excerpt: 'Discover the exciting new features in React 19',
        featuredImage: 'https://picsum.photos/seed/react/800/400',
        isPublished: true,
        views: 890,
        readTime: 4,
        authorId: admin._id,
        publishedAt: new Date(),
        tags: [tags[2]._id, tags[5]._id]
      },
      {
        parentId: parentBlogs[2]._id,
        title: 'Building REST APIs with Node.js',
        slug: 'building-rest-apis-nodejs',
        content: sampleContent,
        excerpt: 'A comprehensive guide to building RESTful APIs',
        featuredImage: 'https://picsum.photos/seed/nodejs/800/400',
        isPublished: true,
        views: 2100,
        readTime: 8,
        authorId: admin._id,
        publishedAt: new Date(),
        tags: [tags[3]._id, tags[5]._id]
      }
    ]);
    console.log(`Created ${childBlogs.length} child blogs`);

    // Create Sample Comments
    await Comment.insertMany([
      {
        blogId: childBlogs[0]._id,
        name: 'John Doe',
        email: 'john@example.com',
        content: 'Great article! Very informative.',
        isApproved: true
      },
      {
        blogId: childBlogs[1]._id,
        name: 'Jane Smith',
        email: 'jane@example.com',
        content: 'Thanks for sharing this!',
        isApproved: true
      }
    ]);
    console.log('Sample comments created');

    console.log('\n✅ Database seeded successfully!');
    console.log('📝 Admin credentials:');
    console.log('   Email: admin@blog.com');
    console.log('   Password: Admin@123');
    console.log('   URL: http://localhost:5000');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();