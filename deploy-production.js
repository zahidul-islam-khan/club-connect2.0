#!/usr/bin/env node

/**
 * Production deployment script for Club Connect
 * This script sets up the production database and runs initial migrations
 */

const { execSync } = require('child_process');

console.log('🚀 Setting up production database...');

try {
  // 1. Generate Prisma client for production
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 2. Deploy database schema to production
  console.log('🗄️  Deploying database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  // 3. Seed the database with initial data
  console.log('🌱 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('✅ Production deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
