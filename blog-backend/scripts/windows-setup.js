const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========================================');
console.log('     Blog Backend - Windows Setup       ');
console.log('========================================');

// Create required directories
const directories = [
  'dist',
  'uploads',
  'locales/en',
  'locales/es',
  'locales/fr',
  'locales/de',
  'logs'
];

directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create default locale files
const locales = {
  'en': {
    "welcome": "Welcome to the Blog",
    "home": "Home",
    "blogs": "Blogs",
    "about": "About",
    "contact": "Contact",
    "search": "Search",
    "read_more": "Read More"
  },
  'es': {
    "welcome": "Bienvenido al Blog",
    "home": "Inicio",
    "blogs": "Blogs",
    "about": "Acerca de",
    "contact": "Contacto",
    "search": "Buscar",
    "read_more": "Leer Más"
  },
  'fr': {
    "welcome": "Bienvenue sur le Blog",
    "home": "Accueil",
    "blogs": "Blogs",
    "about": "À propos",
    "contact": "Contact",
    "search": "Rechercher",
    "read_more": "Lire la suite"
  },
  'de': {
    "welcome": "Willkommen im Blog",
    "home": "Startseite",
    "blogs": "Blogs",
    "about": "Über uns",
    "contact": "Kontakt",
    "search": "Suchen",
    "read_more": "Weiterlesen"
  }
};

Object.entries(locales).forEach(([lang, translations]) => {
  const filePath = path.join(__dirname, '..', 'locales', lang, 'translation.json');
  fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
  console.log(`✅ Created ${lang} translations`);
});

// Create .env file if doesn't exist
const envExamplePath = path.join(__dirname, '..', '.env.example');
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env file from .env.example');
  
  // Update default values for Windows
  const envContent = fs.readFileSync(envPath, 'utf8');
  const updatedContent = envContent
    .replace('DB_HOST=localhost', 'DB_HOST=localhost')
    .replace('DB_USER=postgres', 'DB_USER=postgres')
    .replace('DB_PASSWORD=postgres', 'DB_PASSWORD=your_password_here')
    .replace('JWT_SECRET=your-super-secret-jwt-key-change-this-in-production', 
             `JWT_SECRET=${require('crypto').randomBytes(64).toString('hex')}`);
  
  fs.writeFileSync(envPath, updatedContent);
  console.log('✅ Updated .env with secure defaults');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
}

// Create a basic README for Windows
const readmeContent = `# Blog Backend - Windows Setup

## Quick Start Commands

### Using npm scripts:
\`\`\`bash
# Clean install (if having issues)
npm run windows:clean
npm run windows:install

# Development
npm run dev

# Production
npm run build
npm start
\`\`\`

### Using direct commands:
\`\`\`bash
# Install with legacy peer deps (if having version conflicts)
npm install --legacy-peer-deps

# Run with ts-node-dev
npx ts-node-dev src/server.ts

# Or with nodemon
npx nodemon src/server.ts
\`\`\`

## Environment Setup

1. Edit \`.env\` file with your PostgreSQL credentials
2. Make sure PostgreSQL is running on port 5432
3. Create database: \`personal_blog\`

## Troubleshooting

### If "pg" module fails:
\`\`\`bash
npm rebuild pg
\`\`\`

### If typescript errors:
\`\`\`bash
npx tsc --init
npm run type-check
\`\`\`

### If still issues, try:
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
\`\`\`
`;

fs.writeFileSync(path.join(__dirname, '..', 'WINDOWS_SETUP.md'), readmeContent);

console.log('\n========================================');
console.log('          Setup Complete!              ');
console.log('========================================');
console.log('Next Steps:');
console.log('1. Edit .env file with your database credentials');
console.log('2. Install dependencies: npm install');
console.log('3. Run: npm run dev');
console.log('4. Server will start at: http://localhost:5000');
console.log('\nFor Windows-specific help, see WINDOWS_SETUP.md');
console.log('========================================\n');