# Vercel Login Issue - Debugging Guide

## Problem
User can sign up (user is created in database) but cannot log in on Vercel deployment. Works fine locally.

## Changes Made

1. **Added proper cookie configuration** in `src/lib/auth.ts`
   - Set `useSecureCookies` for production
   - Configured secure cookies with proper sameSite settings
   - Added debug logging

2. **Added console logging** to track authentication flow
   - Login attempts
   - Authentication results
   - JWT and session callbacks

3. **Improved error handling** in login page

## Steps to Debug on Vercel

### 1. Check Vercel Function Logs

After deploying, try to log in and immediately check:
- Go to Vercel Dashboard → Your Project → Deployments
- Click on the latest deployment
- Go to "Functions" tab
- Look for logs from `/api/auth/[...nextauth]`

You should see console logs like:
```
Attempting login for: username
User authenticated successfully: username
JWT callback - user added to token: user-id
Session callback - token added to session: user-id
```

### 2. Verify Environment Variables

Make sure these are set in Vercel:
```
NEXTAUTH_URL=https://your-exact-vercel-url.vercel.app
NEXTAUTH_SECRET=your-generated-secret
DATABASE_URL=your-database-connection-string
```

**Critical:** 
- `NEXTAUTH_URL` must match your Vercel URL EXACTLY
- No trailing slash
- Must use `https://`

### 3. Test Database Connection

The user is being created, so database connection works. But verify:
- Can you see the user in your database?
- Is the password hashed correctly?
- Try logging in with the exact username (case-sensitive)

### 4. Check Browser Console

Open browser DevTools (F12) and check:
- Console tab for any errors
- Network tab to see the `/api/auth/callback/credentials` request
- Application tab → Cookies to see if session cookie is being set

### 5. Common Issues & Solutions

#### Issue: "Invalid username or password" but credentials are correct

**Possible causes:**
1. Database connection issue (but signup works, so unlikely)
2. Password comparison failing
3. Cookie not being set/read properly

**Solution:**
- Check Vercel Function logs for the exact error
- Verify `NEXTAUTH_SECRET` is set
- Try creating a new user directly on production

#### Issue: Login succeeds but redirects back to login page

**Possible causes:**
1. Session cookie not being set
2. Middleware rejecting the session
3. `NEXTAUTH_URL` mismatch

**Solution:**
- Check if cookie is being set in browser DevTools
- Verify `NEXTAUTH_URL` matches exactly
- Check middleware logs

#### Issue: "Something went wrong" error

**Possible causes:**
1. Database connection lost
2. Prisma client error
3. NextAuth configuration error

**Solution:**
- Check Vercel Function logs for stack trace
- Verify DATABASE_URL is correct
- Check if Prisma migrations are applied

### 6. Quick Test

Try this test user on production:
1. Sign up with a new account
2. Immediately try to log in with the same credentials
3. Check Vercel Function logs to see where it fails

### 7. Temporary Debug Mode

The code now has `debug: true` enabled. This will show detailed logs in Vercel Functions. After fixing the issue, you can change it to:
```typescript
debug: process.env.NODE_ENV === "development"
```

## Expected Behavior

When login works correctly, you should see:
1. Browser console: "Attempting login for: username"
2. Vercel logs: "User authenticated successfully: username"
3. Vercel logs: "JWT callback - user added to token: user-id"
4. Vercel logs: "Session callback - token added to session: user-id"
5. Browser console: "Login successful, redirecting..."
6. Redirect to /dashboard

## Next Steps

1. Deploy the updated code
2. Try logging in
3. Check Vercel Function logs immediately
4. Share the logs if issue persists

The logs will tell us exactly where the authentication is failing.
