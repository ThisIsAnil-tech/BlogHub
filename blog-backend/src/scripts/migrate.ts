import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Get counts
    const db = mongoose.connection.db;
    
    const usersCount = await db.collection('users').countDocuments();
    const parentBlogsCount = await db.collection('parentblogs').countDocuments();
    const childBlogsCount = await db.collection('childblogs').countDocuments();
    const tagsCount = await db.collection('tags').countDocuments();
    const commentsCount = await db.collection('comments').countDocuments();
    
    console.log('\n📊 Document counts:');
    console.log(`   Users: ${usersCount}`);
    console.log(`   Parent Blogs: ${parentBlogsCount}`);
    console.log(`   Child Blogs: ${childBlogsCount}`);
    console.log(`   Tags: ${tagsCount}`);
    console.log(`   Comments: ${commentsCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Migration check completed');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrate();