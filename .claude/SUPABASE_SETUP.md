# Supabase Setup Guide

For the contact form to persist data in production (on Vercel), you need to set up Supabase.

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project (choose a region close to you)

## Step 2: Create the Contacts Table

In the Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  expertise TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for the API)
CREATE POLICY "Allow anonymous inserts" ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Create policy for admin reads (you'll need to set up auth for this)
-- For now, you can view data directly in Supabase dashboard
```

## Step 3: Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (safe to use in frontend)

## Step 4: Add Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

For Vercel deployment, add these same variables in:
- Vercel Dashboard → Your Project → Settings → Environment Variables

## Step 5: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 6: Update Contact API

Once you have Supabase set up, I can update the `/api/contact` route to use Supabase instead of local JSON file storage. The updated code would:

1. Connect to Supabase
2. Insert contact submissions into the `contacts` table
3. Work reliably in both local and production environments

---

## Current Status

Right now, the contact form:
- ✅ Works locally (saves to `data/contacts.json`)
- ⚠️ Won't persist on Vercel (serverless, no filesystem)
- 📋 Logs submissions (visible in Vercel logs)

After Supabase setup:
- ✅ Works locally
- ✅ Works on Vercel
- ✅ Data persists in Supabase dashboard
- ✅ Can query/export submissions

---

## Let Me Know When Ready

Once you've completed steps 1-5, let me know and I'll update the contact API to use Supabase.
