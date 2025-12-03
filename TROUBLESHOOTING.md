# Troubleshooting Login Issues on Vercel

## Quick Diagnosis

I've added two test endpoints to help diagnose the issue:

### 1. Test Database Connection
Visit: `https://your-app.vercel.app/api/test-db`

This will show:
- ✅ If database is connected
- ✅ Number of users in database
- ✅ First user details (without password)

**Expected result:**
```json
{
  "success": true,
  "connected": true,
  "userCount": 1,
  "firstUser": {
    "id": "...",
    "username": "testuser",
    "fullName": "Test User",
    "role": "USER"
  }
}
```

### 2. Test Authentication Setup
Visit: `https://your-app.vercel.app/api/test-auth`

This will show:
- ✅ If you have an active session
- ✅ If environment variables are set
- ✅ Current environment

**Expected result (before login):**
```json
{
  "success": true,
  "hasSession": false,
  "session": null,
  "env": {
    "hasNextAuthUrl": true,
    "hasNextAuthSecret": true,
    "hasDatabaseUrl": true,
    "nodeEnv": "production"
  }
}
```

## Step-by-Step Diagnosis

### Step 1: Check Environment Variables

In Vercel Dashboard → Settings → Environment Variables, verify:

```
✅ NEXTAUTH_URL = https://your-app.vercel.app
✅ NEXTAUTH_SECRET = (some long random string)
✅ DATABASE_URL = postgresql://...
```

**Common mistakes:**
- ❌ `NEXTAUTH_URL` has trailing slash: `https://app.vercel.app/`
- ❌ `NEXTAUTH_URL` uses http instead of https
- ❌ `NEXTAUTH_SECRET` is not set
- ❌ Environment variables only set for "Production" but testing on "Preview"

**Fix:** Set variables for ALL environments (Production, Preview, Development)

### Step 2: Test Database Connection

1. Visit `https://your-app.vercel.app/api/test-db`
2. Check if it shows your users

**If it fails:**
- Database is not accessible from Vercel
- DATABASE_URL is incorrect
- Migrations haven't been run

**Fix:**
```bash
# Run migrations on production database
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Step 3: Test a Login

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to log in
4. Look for console logs

**You should see:**
```
Attempting login for: username
Login result: { ok: true, ... }
Login successful, redirecting...
```

**If you see error:**
```
Login result: { error: "CredentialsSignin", ok: false }
```

This means authentication failed. Check Vercel Function logs.

### Step 4: Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments"
4. Click latest deployment
5. Click "Functions" tab
6. Look for `/api/auth/callback/credentials`

**You should see:**
```
Looking up user: username
User found, checking password...
User authenticated successfully: username
JWT callback - user added to token: user-id
```

**Common issues:**

**Issue A: "User not found"**
- User doesn't exist in production database
- Username is case-sensitive
- Fix: Create user again on production

**Issue B: "Invalid password"**
- Password hash doesn't match
- Possible bcrypt version mismatch
- Fix: Create new user on production

**Issue C: No logs at all**
- Function not being called
- NEXTAUTH_URL mismatch
- Fix: Verify NEXTAUTH_URL exactly matches your domain

### Step 5: Check Browser Cookies

1. Open DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Look under Cookies
4. Check for `next-auth.session-token` or `__Secure-next-auth.session-token`

**If cookie is not set:**
- Authentication is failing
- NEXTAUTH_SECRET might be missing
- Cookie settings might be wrong

### Step 6: Try Creating a New User on Production

1. Go to your Vercel app
2. Click "Sign Up"
3. Create a completely new user
4. Immediately try to log in with that user
5. Check Vercel Function logs

This will tell us if the issue is with:
- Old users (password hash issue)
- Authentication system (affects all users)

## Common Solutions

### Solution 1: NEXTAUTH_SECRET Not Set

**Symptom:** Login fails silently, no errors

**Fix:**
```bash
# Generate a secret
openssl rand -base64 32

# Add to Vercel environment variables
NEXTAUTH_SECRET=<paste-the-generated-secret>
```

### Solution 2: NEXTAUTH_URL Mismatch

**Symptom:** Redirects back to login page after successful login

**Fix:**
Make sure NEXTAUTH_URL in Vercel matches EXACTLY:
```
NEXTAUTH_URL=https://your-exact-app-name.vercel.app
```

No trailing slash, must be https, must match exactly.

### Solution 3: Database Not Accessible

**Symptom:** `/api/test-db` returns error

**Fix:**
- Use a cloud database (Neon, Supabase, Railway)
- Make sure database allows connections from anywhere (0.0.0.0/0)
- Check if database requires SSL: add `?sslmode=require` to DATABASE_URL

### Solution 4: Migrations Not Run

**Symptom:** Database errors in logs

**Fix:**
```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Solution 5: Password Hash Mismatch

**Symptom:** "Invalid password" in logs but password is correct

**Fix:**
Create a new user directly on production and test with that.

## Still Not Working?

1. Visit `/api/test-db` and share the result
2. Visit `/api/test-auth` and share the result
3. Try to log in and share the Vercel Function logs
4. Share any error messages from browser console

With this information, we can pinpoint the exact issue.
