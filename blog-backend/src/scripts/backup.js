const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const backupDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is missing');
    process.exit(1);
  }

  const backupDir = path.join(__dirname, '../../database/backups');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const currentBackupDir = path.join(backupDir, `backup-${timestamp}`);

  try {
    console.log('🔄 Connecting to MongoDB for backup...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected. Fetching collections...');

    if (!fs.existsSync(currentBackupDir)) {
      fs.mkdirSync(currentBackupDir, { recursive: true });
    }

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const col of collections) {
      const name = col.name;
      console.log(`📦 Dumping collection: ${name}`);
      const data = await db.collection(name).find({}).toArray();
      fs.writeFileSync(
        path.join(currentBackupDir, `${name}.json`),
        JSON.stringify(data, null, 2)
      );
    }

    console.log(`✅ Backup successfully saved to: ${currentBackupDir}`);

    // Retain only last 7 backups
    if (fs.existsSync(backupDir)) {
      const backups = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('backup-') && fs.statSync(path.join(backupDir, f)).isDirectory())
        .sort()
        .reverse();

      if (backups.length > 7) {
        backups.slice(7).forEach(dir => {
          const dirPath = path.join(backupDir, dir);
          fs.rmSync(dirPath, { recursive: true, force: true });
          console.log(`🗑️ Removed old backup directory: ${dir}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔄 Disconnected from MongoDB');
  }
};

backupDatabase();