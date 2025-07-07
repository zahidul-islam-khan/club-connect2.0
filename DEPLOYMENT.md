# 🚀 Club Connect - Vercel Deployment Guide

## Prerequisites
1. Vercel account (free)
2. PostgreSQL database (Neon, Supabase, or Vercel Postgres)
3. GitHub repository

## 📋 Deployment Steps

### 1. Database Setup (Choose One)

#### Option A: Vercel Postgres (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Create Postgres database
vercel postgres create club-connect-db
```

#### Option B: Neon (Free PostgreSQL)
1. Go to https://neon.tech
2. Create free account
3. Create new project: "club-connect"
4. Copy connection string

#### Option C: Supabase (Free PostgreSQL)  
1. Go to https://supabase.com
2. Create free account
3. Create new project: "club-connect"
4. Go to Settings > Database
5. Copy connection string

### 2. GitHub Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/club-connect.git
git push -u origin main
```

### 3. Vercel Deployment
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Configure environment variables:

#### Required Environment Variables:
```env
DATABASE_URL=postgresql://username:password@hostname:port/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secure-random-secret-here
RESEND_API_KEY=your-resend-api-key (optional for emails)
```

#### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 4. Database Migration
After first deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project  
vercel link

# Run database migration
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed  # Optional: seed with demo data
```

### 5. Custom Domain (Optional)
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain

## 🔧 Production Configuration

### Database Schema
- Uses PostgreSQL instead of SQLite
- All relationships and constraints preserved
- Optimized for serverless deployment

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your app's URL (auto-set by Vercel)
- `NEXTAUTH_SECRET`: Secure random string for JWT signing
- `RESEND_API_KEY`: For email notifications (optional)

### Build Process
1. `prisma generate` - Generate database client
2. `next build` - Build Next.js application
3. Automatic optimization for serverless

## 🎯 Demo Credentials
After seeding database:
- **Admin:** admin@bracu.ac.bd / admin123
- **Club Leader:** leader@bracu.ac.bd / leader123  
- **Student:** student@bracu.ac.bd / student123

## 🔍 Monitoring
- Check Vercel Functions tab for API performance
- Monitor database usage in your provider dashboard
- Use Vercel Analytics for user metrics

## 🛠️ Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Database Connection Issues
- Verify DATABASE_URL format
- Check database provider firewall settings
- Ensure database is running

### Migration Errors
```bash
# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Apply migrations manually
npx prisma migrate deploy
```

## 📝 Notes
- SQLite files don't persist on Vercel
- PostgreSQL is required for production
- First deployment may take longer due to dependencies
- Use Vercel Analytics for performance monitoring
