# Production Database Setup Guide

## Quick Fix for Current Issue

Your app is deployed but the database tables don't exist. Here's how to fix it:

### Step 1: Setup Local Environment with Production Database

1. **Update your `.env` file** with your Supabase credentials:
```bash
# Use your actual Supabase connection strings
DATABASE_URL="postgresql://postgres.your-project-ref:your-password@aws-0-us-east-1.pooler.supabase.co:6543/postgres"
DIRECT_URL="postgresql://postgres.your-project-ref:your-password@aws-0-us-east-1.pooler.supabase.co:5432/postgres"

# Your other environment variables
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-app.vercel.app"
RESEND_API_KEY="your-resend-key"
```

### Step 2: Run Database Setup

Run this command in your project directory:

```bash
npm run db:setup-production
```

This will:
- Generate Prisma client
- Create all database tables in Supabase
- Seed the database with initial data (clubs, admin user, etc.)

### Step 3: Verify Setup

After running the setup, your Supabase database should have:
- User authentication tables
- Club management tables
- Event management tables
- Sample BRAC University clubs
- An admin user for testing

### Step 4: Test the Application

1. Go to your deployed app
2. Try creating a new account
3. Login and explore the features

## Alternative: Manual Database Setup

If the automatic setup doesn't work, you can manually run these commands:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Create database tables
npx prisma db push --accept-data-loss

# 3. Seed with initial data
npx prisma db seed
```

## Troubleshooting

### "Table does not exist" error:
- Make sure you ran `npx prisma db push` to create tables
- Check that your DATABASE_URL is correct
- Verify your Supabase project is active

### "Connection refused" error:
- Check your Supabase connection strings
- Ensure your project isn't paused
- Verify the database password

### "Seed failed" error:
- The app will still work, you just won't have sample data
- You can manually create an admin user through the signup page

## Success Indicators

✅ No database errors on signup/signin
✅ Can create and edit profile
✅ Can see sample clubs on the clubs page
✅ Admin panel accessible (if you're an admin user)

## Next Steps

Once the database is set up:
1. Create your admin account
2. Test profile updates and image uploads
3. Create some test clubs and events
4. Invite team members to test different roles
