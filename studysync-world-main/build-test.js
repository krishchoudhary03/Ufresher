// Simple build test script
const { execSync } = require('child_process');

console.log('Testing build process...');

try {
  // Check if we can run the build command
  console.log('Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
