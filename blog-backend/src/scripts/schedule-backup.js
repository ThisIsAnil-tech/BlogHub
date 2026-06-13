const cron = require('node-cron');
const { exec } = require('child_process');

console.log('📅 Setting up automatic database backup...');

// Backup every day at 2 AM
cron.schedule('0 2 * * *', () => {
  console.log('🔄 Running scheduled database backup...');
  exec('npm run backup', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Backup failed:', error);
    } else {
      console.log('✅ Backup completed:', stdout);
    }
  });
});

console.log('✅ Automatic backup scheduled (daily at 2 AM)');
console.log('Press Ctrl+C to stop');