-- ============================================
-- RLS POLICIES AND HELPER FUNCTIONS
-- Run this to complete your Supabase backend setup
-- ============================================

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- THERAPISTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Therapists can view their own profile" ON therapists;
CREATE POLICY "Therapists can view their own profile" ON therapists
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Therapists can update their own profile" ON therapists;
CREATE POLICY "Therapists can update their own profile" ON therapists
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can create therapist profile" ON therapists;
CREATE POLICY "Anyone can create therapist profile" ON therapists
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Therapists can view all therapists" ON therapists;
CREATE POLICY "Therapists can view all therapists" ON therapists
  FOR SELECT USING (true);

-- ============================================
-- PATIENTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Patients can view their own profile" ON patients;
CREATE POLICY "Patients can view their own profile" ON patients
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Patients can update their own profile" ON patients;
CREATE POLICY "Patients can update their own profile" ON patients
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Therapists can view their patients" ON patients;
CREATE POLICY "Therapists can view their patients" ON patients
  FOR SELECT USING (therapist_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can create patient profile" ON patients;
CREATE POLICY "Anyone can create patient profile" ON patients
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Therapists can update their patients" ON patients;
CREATE POLICY "Therapists can update their patients" ON patients
  FOR UPDATE USING (therapist_id = auth.uid());

-- ============================================
-- SESSIONS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Therapists can view their sessions" ON sessions;
CREATE POLICY "Therapists can view their sessions" ON sessions
  FOR SELECT USING (therapist_id = auth.uid());

DROP POLICY IF EXISTS "Patients can view their sessions" ON sessions;
CREATE POLICY "Patients can view their sessions" ON sessions
  FOR SELECT USING (patient_id = auth.uid());

DROP POLICY IF EXISTS "Therapists can create sessions" ON sessions;
CREATE POLICY "Therapists can create sessions" ON sessions
  FOR INSERT WITH CHECK (therapist_id = auth.uid());

DROP POLICY IF EXISTS "Therapists can update their sessions" ON sessions;
CREATE POLICY "Therapists can update their sessions" ON sessions
  FOR UPDATE USING (therapist_id = auth.uid());

DROP POLICY IF EXISTS "Therapists can delete their sessions" ON sessions;
CREATE POLICY "Therapists can delete their sessions" ON sessions
  FOR DELETE USING (therapist_id = auth.uid());

-- ============================================
-- ASSESSMENTS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Therapists can view assessments" ON assessments;
CREATE POLICY "Therapists can view assessments" ON assessments
  FOR SELECT USING (therapist_id = auth.uid());

DROP POLICY IF EXISTS "Patients can view their own assessments" ON assessments;
CREATE POLICY "Patients can view their own assessments" ON assessments
  FOR SELECT USING (patient_id = auth.uid());

DROP POLICY IF EXISTS "Therapists can create assessments" ON assessments;
CREATE POLICY "Therapists can create assessments" ON assessments
  FOR INSERT WITH CHECK (therapist_id = auth.uid());

DROP POLICY IF EXISTS "Therapists can update assessments" ON assessments;
CREATE POLICY "Therapists can update assessments" ON assessments
  FOR UPDATE USING (therapist_id = auth.uid());

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get therapist statistics
CREATE OR REPLACE FUNCTION get_therapist_stats(therapist_uuid UUID, date_range INTEGER DEFAULT 30)
RETURNS TABLE (
  total_sessions BIGINT,
  completed_sessions BIGINT,
  cancelled_sessions BIGINT,
  pending_sessions BIGINT,
  active_patients BIGINT,
  total_hours NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_sessions,
    COUNT(*) FILTER (WHERE status IN ('scheduled', 'pending')) as pending_sessions,
    COUNT(DISTINCT patient_id) as active_patients,
    ROUND(SUM(duration_minutes)::NUMERIC / 60, 2) as total_hours
  FROM sessions
  WHERE therapist_id = therapist_uuid
    AND scheduled_at >= NOW() - (date_range || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get patient progress
CREATE OR REPLACE FUNCTION get_patient_progress(patient_uuid UUID)
RETURNS TABLE (
  total_sessions BIGINT,
  completed_sessions BIGINT,
  missed_sessions BIGINT,
  latest_assessment_score INTEGER,
  assessment_trend TEXT
) AS $$
DECLARE
  prev_score INTEGER;
  curr_score INTEGER;
BEGIN
  -- Get latest two assessment scores
  SELECT score INTO curr_score
  FROM assessments
  WHERE patient_id = patient_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  SELECT score INTO prev_score
  FROM assessments
  WHERE patient_id = patient_uuid
  ORDER BY created_at DESC
  LIMIT 1 OFFSET 1;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
    COUNT(*) FILTER (WHERE status = 'cancelled') as missed_sessions,
    curr_score as latest_assessment_score,
    CASE 
      WHEN prev_score IS NULL THEN 'insufficient_data'
      WHEN curr_score < prev_score THEN 'improving'
      WHEN curr_score > prev_score THEN 'declining'
      ELSE 'stable'
    END as assessment_trend
  FROM sessions
  WHERE patient_id = patient_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check that all tables exist
DO $$
BEGIN
  RAISE NOTICE 'Setup complete! Verifying tables...';
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'therapists') THEN
    RAISE NOTICE '✓ therapists table exists';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'patients') THEN
    RAISE NOTICE '✓ patients table exists';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions') THEN
    RAISE NOTICE '✓ sessions table exists';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'assessments') THEN
    RAISE NOTICE '✓ assessments table exists';
  END IF;
  
  RAISE NOTICE 'Backend setup complete!';
END $$;
