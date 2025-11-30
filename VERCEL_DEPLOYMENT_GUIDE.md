# Vercel Deployment Guide

## Prerequisites

1. **Database Setup**
   - Use a cloud PostgreSQL database (Neon, Supabase, PlanetScale, or Railway)
   - Get your DATABASE_URL connection string
   - Make sure the database is accessible from the internet

2. **Generate NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output - you'll need it for Vercel

## Step-by-Step Deployment

### 1. Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
```

**Important Notes:**
- `NEXTAUTH_URL` must be your exact Vercel URL (no trailing slash)
- Use `https://` not `http://`
- `NEXTAUTH_SECRET` is required for production
- Make sure DATABASE_URL points to an accessible cloud database

### 2. Run Database Migrations

After setting environment variables, you need to run migrations on your production database:

**Option A: Using Vercel CLI**
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

**Option B: Direct Connection**
```bash
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

**Option C: Seed the Database**
```bash
DATABASE_URL="your-production-database-url" npx prisma db seed
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

Vercel will automatically deploy when you push to your main branch.

### 4. Verify Deployment

1. Check build logs in Vercel dashboard
2. Check Function logs for any runtime errors
3. Test authentication by signing up/logging in

## Common Issues & Solutions

### Issue 1: "Invalid credentials" or authentication fails

**Solution:**
- Verify `NEXTAUTH_SECRET` is set in Vercel
- Verify `NEXTAUTH_URL` matches your Vercel URL exactly
- Check Function logs for specific errors

### Issue 2: Database connection errors

**Solution:**
- Ensure your database is accessible from the internet
- Verify DATABASE_URL is correct
- Check if database requires SSL (add `?sslmode=require` to URL)
- For Neon/Supabase, use the connection pooler URL

### Issue 3: Prisma Client errors

**Solution:**
- The `postinstall` script should handle this automatically
- If issues persist, add to `package.json`:
  ```json
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
  ```

### Issue 4: Images not loading

**Solution:**
- Verify AWS credentials are set correctly in Vercel
- Check S3 bucket CORS configuration
- Ensure bucket policy allows public read access

### Issue 5: "Missing Suspense boundary" errors

**Solution:**
- Already fixed in the code with Suspense wrapper
- Make sure you've pushed the latest changes

## Testing Checklist

- [ ] Can access the homepage
- [ ] Can sign up for a new account
- [ ] Can log in with credentials
- [ ] Can view dashboard after login
- [ ] Can post a new item
- [ ] Images upload successfully
- [ ] Can view item details
- [ ] Can rate items
- [ ] Admin panel works (if admin user)

## Debugging

To see detailed logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Click on the latest deployment
5. Check "Functions" tab for runtime logs
6. Check "Build Logs" for build-time errors

## Database Providers

### Recommended: Neon (Free tier available)
```
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Alternative: Supabase (Free tier available)
```
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

### Alternative: Railway (Free trial)
```
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:7XXX/railway"
```

## Need Help?

If you're still having issues:
1. Check Vercel Function logs for specific error messages
2. Verify all environment variables are set correctly
3. Test database connection separately
4. Ensure you've run migrations on production database
