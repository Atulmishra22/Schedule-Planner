import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const extensionDir = join(rootDir, 'extension');

// Copy manifest.json
console.log('Copying manifest.json...');
copyFileSync(join(extensionDir, 'manifest.json'), join(distDir, 'manifest.json'));

// Copy background.js
console.log('Copying background.js...');
copyFileSync(join(extensionDir, 'background.js'), join(distDir, 'background.js'));

// Copy popup.html
console.log('Copying popup.html...');
copyFileSync(join(extensionDir, 'popup.html'), join(distDir, 'popup.html'));

// Copy icons directory if it exists
const iconsDir = join(extensionDir, 'icons');
if (existsSync(iconsDir)) {
  console.log('Copying icons...');
  const distIconsDir = join(distDir, 'icons');
  
  // Create icons directory if it doesn't exist
  if (!existsSync(distIconsDir)) {
    mkdirSync(distIconsDir, { recursive: true });
  }
  
  // Copy all icon files
  const iconFiles = readdirSync(iconsDir);
  iconFiles.forEach(file => {
    const srcFile = join(iconsDir, file);
    const destFile = join(distIconsDir, file);
    if (statSync(srcFile).isFile()) {
      copyFileSync(srcFile, destFile);
    }
  });
}

console.log('Extension build complete! Load the dist/ folder in Chrome.');
console.log('To load: Chrome > Extensions > Load unpacked > Select dist/ folder');
