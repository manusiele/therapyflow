export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      therapists: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          license_number: string
          specialization: string
          bio: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string
          license_number?: string
          specialization: string
          bio?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          license_number?: string
          specialization?: string
          bio?: string
        }
      }
      patients: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          date_of_birth: string
          emergency_contact: string
          therapist_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string
          date_of_birth?: string
          emergency_contact?: string
          therapist_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          date_of_birth?: string
          emergency_contact?: string
          therapist_id?: string
        }
      }
      sessions: {
        Row: {
          id: string
          therapist_id: string
          patient_id: string
          scheduled_at: string
          duration_minutes: number
          status: string
          notes: string
          session_type: string
        }
        Insert: {
          id?: string
          therapist_id: string
          patient_id: string
          scheduled_at: string
          duration_minutes?: number
          status?: string
          notes?: string
          session_type?: string
        }
        Update: {
          id?: string
          therapist_id?: string
          patient_id?: string
          scheduled_at?: string
          duration_minutes?: number
          status?: string
          notes?: string
          session_type?: string
        }
      }
      assessments: {
        Row: {
          id: string
          patient_id: string
          therapist_id: string
          assessment_type: string
          score: number
          responses: Json
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          therapist_id: string
          assessment_type: string
          score?: number
          responses?: Json
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          therapist_id?: string
          assessment_type?: string
          score?: number
          responses?: Json
          created_at?: string
        }
      }
    }
  }
}
