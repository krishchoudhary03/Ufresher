// Test script to verify build works
console.log('Testing local build...');

// Check if all required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/hooks/useAuth.tsx',
  'src/index.css',
  'index.html',
  'vercel.json'
];

console.log('Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check CSS file for problematic imports
const cssContent = fs.readFileSync('src/index.css', 'utf8');
if (cssContent.includes('@import url(\'https://fonts.googleapis.com')) {
  console.log('❌ CSS still contains Google Fonts import');
} else {
  console.log('✅ CSS is clean');
}

// Check if old useAuth.ts exists
if (fs.existsSync('src/hooks/useAuth.ts')) {
  console.log('❌ Old useAuth.ts still exists');
} else {
  console.log('✅ Old useAuth.ts removed');
}

console.log('Build test complete!');
