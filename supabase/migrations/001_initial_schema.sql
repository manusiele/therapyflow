-- Create therapists table
CREATE TABLE therapists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  license_number TEXT,
  specialization TEXT NOT NULL,
  bio TEXT
);

-- Create patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  emergency_contact TEXT,
  therapist_id UUID REFERENCES therapists(id) ON DELETE SET NULL
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  session_type TEXT DEFAULT 'individual'
);

-- Create assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  score INTEGER,
  responses JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_sessions_therapist_id ON sessions(therapist_id);
CREATE INDEX idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX idx_assessments_patient_id ON assessments(patient_id);
CREATE INDEX idx_patients_therapist_id ON patients(therapist_id);
