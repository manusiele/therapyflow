# ✅ Setup Checklist

## Step 1: Environment Variables ✅ DONE
Your `.env.local` is now configured with the correct credentials.

---

## Step 2: Enable Email Authentication in Supabase

**IMPORTANT**: You must do this or signup will fail!

1. Go to: https://app.supabase.com
2. Select your project: `qarydyorosqypwsxpoxb`
3. Click **Authentication** in the left sidebar
4. Click **Providers**
5. Find **Email** in the list
6. Make sure the toggle is **ON** (enabled/green)
7. Scroll down and configure:
   - **Confirm email**: Turn OFF for development (ON for production)
   - **Secure email change**: Turn OFF for development
8. Click **Save**

---

## Step 3: Run Database Migration

1. In Supabase Dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

This creates your tables: therapists, patients, sessions, assessments

---

## Step 4: Restart Your Dev Server

```bash
# Stop your current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

**IMPORTANT**: You MUST restart for the new environment variables to load!

---

## Step 5: Test Signup

1. Go to: http://localhost:3000/auth/therapist/signup
2. Fill out the form:
   - Name: Test Therapist
   - Email: test@therapist.com
   - Specialization: Clinical Psychology
   - Password: password123
   - Confirm Password: password123
3. Click "Create Therapist Account"
4. You should be redirected to `/dashboard`

---

## Step 6: Verify in Supabase

1. Go to Supabase Dashboard
2. Click **Authentication** > **Users**
3. You should see your test user
4. Click **Table Editor** > **therapists**
5. You should see a therapist record

---

## Troubleshooting

### If you get 401 error:
- Make sure Email provider is enabled (Step 2)
- Restart dev server (Step 4)
- Check browser console for detailed error

### If you get "relation does not exist":
- Run the database migration (Step 3)
- Check Table Editor to verify tables exist

### If nothing happens:
- Check browser console (F12)
- Check terminal for errors
- Verify `.env.local` exists in project root

---

## Quick Test Commands

```bash
# Verify environment variables are loaded
cat .env.local

# Check if dev server is running
curl http://localhost:3000

# Test Supabase connection (in browser console)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

---

## After Successful Signup

Once you can create an account:

1. ✅ Test patient signup: http://localhost:3000/auth/patient/signup
2. ✅ Test login: http://localhost:3000/auth/therapist/login
3. ✅ Test patient login: http://localhost:3000/auth/patient/login
4. ✅ Explore the dashboard
5. ✅ Create a session
6. ✅ Add session notes

---

## Security Reminder

Before going to production:
- [ ] Enable email confirmation
- [ ] Enable Row Level Security (RLS)
- [ ] Add RLS policies (see SECURITY_URGENT.md)
- [ ] Set up proper email templates
- [ ] Configure password requirements

---

## You're Ready!

Your Supabase is now properly configured. Just:
1. Enable Email provider in Supabase
2. Run the database migration
3. Restart your dev server
4. Start testing!

🎉 Happy coding!
