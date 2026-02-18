# Supabase Backend Setup Guide

## Prerequisites
- Supabase account at https://supabase.com
- Supabase project created
- Environment variables configured in `.env.local`

## Step 1: Run Database Migrations

You have three migration files that need to be executed in order:

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_messages_schema.sql`
   - `supabase/migrations/003_video_presence.sql`
5. Click **Run** for each migration

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project ref from dashboard URL)
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## Step 2: Set Up Row Level Security (RLS) Policies

After running the migrations, you need to add RLS policies for the main tables.

### Run this SQL in Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_presence ENABLE ROW LEVEL SECURITY;

-- Therapists Policies
CREATE POLICY "Therapists can view their own profile" ON therapists
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Therapists can update their own profile" ON therapists
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can create therapist profile" ON therapists
  FOR INSERT WITH CHECK (true);

-- Patients Policies
CREATE POLICY "Patients can view their own profile" ON patients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Patients can update their own profile" ON patients
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Therapists can view their patients" ON patients
  FOR SELECT USING (therapist_id = auth.uid());

CREATE POLICY "Anyone can create patient profile" ON patients
  FOR INSERT WITH CHECK (true);

-- Sessions Policies
CREATE POLICY "Therapists can view their sessions" ON sessions
  FOR SELECT USING (therapist_id = auth.uid());

CREATE POLICY "Patients can view their sessions" ON sessions
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Therapists can create sessions" ON sessions
  FOR INSERT WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can update their sessions" ON sessions
  FOR UPDATE USING (therapist_id = auth.uid());

CREATE POLICY "Therapists can delete their sessions" ON sessions
  FOR DELETE USING (therapist_id = auth.uid());

-- Assessments Policies
CREATE POLICY "Therapists can view assessments for their patients" ON assessments
  FOR SELECT USING (
    therapist_id = auth.uid() OR 
    patient_id IN (SELECT id FROM patients WHERE therapist_id = auth.uid())
  );

CREATE POLICY "Patients can view their own assessments" ON assessments
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Therapists can create assessments" ON assessments
  FOR INSERT WITH CHECK (therapist_id = auth.uid());

-- Session Presence Policies
CREATE POLICY "Users can view presence for their sessions" ON session_presence
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM sessions 
      WHERE therapist_id = auth.uid() OR patient_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own presence" ON session_presence
  FOR ALL USING (user_id = auth.uid());
```

## Step 3: Configure Authentication

### In Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://therapyflowclinic.vercel.app`
3. Add **Redirect URLs**:
   - `https://therapyflowclinic.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)

4. Go to **Authentication** → **Email Templates**
5. Customize the email templates if needed

## Step 4: Set Up Storage (Optional - for profile pictures, documents)

```sql
-- Create storage bucket for user files
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for documents
CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Step 5: Create Helper Functions

```sql
-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $
DECLARE
  role TEXT;
BEGIN
  -- Check if user is a therapist
  SELECT 'therapist' INTO role
  FROM therapists
  WHERE id = user_id
  LIMIT 1;
  
  IF role IS NOT NULL THEN
    RETURN role;
  END IF;
  
  -- Check if user is a patient
  SELECT 'patient' INTO role
  FROM patients
  WHERE id = user_id
  LIMIT 1;
  
  RETURN role;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get upcoming sessions
CREATE OR REPLACE FUNCTION get_upcoming_sessions(user_id UUID, days_ahead INTEGER DEFAULT 7)
RETURNS TABLE (
  id UUID,
  therapist_id UUID,
  patient_id UUID,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  status TEXT,
  session_type TEXT,
  therapist_name TEXT,
  patient_name TEXT
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.therapist_id,
    s.patient_id,
    s.scheduled_at,
    s.duration_minutes,
    s.status,
    s.session_type,
    t.name as therapist_name,
    p.name as patient_name
  FROM sessions s
  LEFT JOIN therapists t ON s.therapist_id = t.id
  LEFT JOIN patients p ON s.patient_id = p.id
  WHERE (s.therapist_id = user_id OR s.patient_id = user_id)
    AND s.scheduled_at >= NOW()
    AND s.scheduled_at <= NOW() + (days_ahead || ' days')::INTERVAL
    AND s.status != 'cancelled'
  ORDER BY s.scheduled_at ASC;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Step 6: Verify Setup

Run this query to verify all tables are created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- assessments
- conversations
- messages
- patients
- session_presence
- sessions
- therapists

## Step 7: Test with Sample Data (Optional)

```sql
-- Insert sample therapist
INSERT INTO therapists (id, name, email, specialization, license_number, bio)
VALUES (
  gen_random_uuid(),
  'Dr. Sarah Johnson',
  'sarah.johnson@therapyflow.com',
  'Clinical Psychology, Cognitive Behavioral Therapy',
  'PSY-12345-CA',
  'Experienced clinical psychologist specializing in CBT and trauma-informed care.'
);

-- Get the therapist ID for next insert
-- (Replace with actual ID from above insert)

-- Insert sample patient
INSERT INTO patients (id, name, email, therapist_id)
VALUES (
  gen_random_uuid(),
  'John Doe',
  'john.doe@email.com',
  'THERAPIST_ID_HERE'
);
```

## Troubleshooting

### Issue: RLS policies blocking access
**Solution**: Check that user metadata includes the role field during signup

### Issue: Functions not working
**Solution**: Ensure functions are created with `SECURITY DEFINER` flag

### Issue: Cannot insert data
**Solution**: Verify RLS policies allow INSERT operations for your use case

## Next Steps

1. Update your frontend to use real data from Supabase
2. Test authentication flow
3. Test CRUD operations for each table
4. Set up real-time subscriptions for messages
5. Configure email notifications

## Important Notes

- Always test RLS policies thoroughly before going to production
- Keep your Supabase keys secure (never commit to git)
- Use environment variables for all sensitive data
- Set up database backups in Supabase dashboard
- Monitor usage and set up alerts for quota limits
