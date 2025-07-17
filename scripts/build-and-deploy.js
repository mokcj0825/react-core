const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration constants
const BUILD_DIR = 'dist';
const FIREBASE_CONFIG = 'firebase.json';

// Build and deploy script for scalable deployment
async function buildAndDeploy() {
  try {
    console.log('🚀 Starting build and deploy process...');
    
    // Step 1: Clean previous build
    console.log('📁 Cleaning previous build...');
    if (fs.existsSync(BUILD_DIR)) {
      fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    }
    
    // Step 2: Build the application
    console.log('🔨 Building application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Step 3: Verify build output
    console.log('✅ Verifying build output...');
    if (!fs.existsSync(BUILD_DIR)) {
      throw new Error('Build directory not found');
    }
    
    // Step 4: Check for dynamic import chunks
    const buildFiles = fs.readdirSync(BUILD_DIR);
    const hasChunks = buildFiles.some(file => file.includes('chunk') || file.includes('assets'));
    
    if (!hasChunks) {
      console.warn('⚠️  Warning: No chunk files found. Dynamic imports may not work properly.');
    }
    
    // Step 5: Deploy to Firebase
    console.log('🔥 Deploying to Firebase...');
    execSync('firebase deploy --only hosting', { stdio: 'inherit' });
    
    console.log('🎉 Deployment completed successfully!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run the build and deploy process
buildAndDeploy(); 