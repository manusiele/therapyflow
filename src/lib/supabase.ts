import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Type aliases for easier use
export type Therapist = Database['public']['Tables']['therapists']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Assessment = Database['public']['Tables']['assessments']['Row']

export type TherapistInsert = Database['public']['Tables']['therapists']['Insert']
export type PatientInsert = Database['public']['Tables']['patients']['Insert']
export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type AssessmentInsert = Database['public']['Tables']['assessments']['Insert']

// Authentication helpers
export const auth = {
  signUp: async (email: string, password: string, role: 'therapist' | 'client', profileData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          ...profileData
        }
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Therapist operations
export const therapists = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('therapists')
      .select('*')
      .order('name')
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  getByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('therapists')
      .select('*')
      .eq('email', email)
      .single()
    return { data, error }
  },

  create: async (therapist: TherapistInsert) => {
    const { data, error } = await supabase
      .from('therapists')
      .insert(therapist as any)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: Partial<TherapistInsert>) => {
    const { data, error } = await supabase
      .from('therapists')
      // @ts-expect-error - Supabase generated types issue with update method
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('therapists')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Patient operations
export const patients = {
  getAll: async (therapistId?: string) => {
    let query = supabase.from('patients').select('*').order('name')
    
    if (therapistId) {
      query = query.eq('therapist_id', therapistId)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  getByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email)
      .single()
    return { data, error }
  },

  create: async (patient: PatientInsert) => {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient as any)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: Partial<PatientInsert>) => {
    const { data, error } = await supabase
      .from('patients')
      // @ts-expect-error - Supabase generated types issue with update method
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Session operations
export const sessions = {
  getAll: async (filters?: { therapistId?: string; patientId?: string; date?: string }) => {
    let query = supabase
      .from('sessions')
      .select(`
        *,
        therapist:therapists(*),
        patient:patients(*)
      `)
      .order('scheduled_at', { ascending: true })
    
    if (filters?.therapistId) {
      query = query.eq('therapist_id', filters.therapistId)
    }
    
    if (filters?.patientId) {
      query = query.eq('patient_id', filters.patientId)
    }
    
    if (filters?.date) {
      const startOfDay = new Date(filters.date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(filters.date)
      endOfDay.setHours(23, 59, 59, 999)
      
      query = query
        .gte('scheduled_at', startOfDay.toISOString())
        .lte('scheduled_at', endOfDay.toISOString())
    }
    
    const { data, error } = await query
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        therapist:therapists(*),
        patient:patients(*)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  create: async (session: SessionInsert) => {
    const { data, error } = await supabase
      .from('sessions')
      .insert(session as any)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: Partial<SessionInsert>) => {
    const { data, error } = await supabase
      .from('sessions')
      // @ts-expect-error - Supabase generated types issue with update method
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id)
    return { error }
  },

  updateNotes: async (id: string, notes: string) => {
    const { data, error } = await supabase
      .from('sessions')
      // @ts-expect-error - Supabase generated types issue with update method
      .update({ notes, status: 'completed' })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Message operations
export const messages = {
  getConversations: async (userId: string, userType: 'therapist' | 'patient') => {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        therapist:therapists(*),
        patient:patients(*)
      `)
      .or(`therapist_id.eq.${userId},patient_id.eq.${userId}`)
      .order('last_message_at', { ascending: false })
    return { data, error }
  },

  getMessages: async (senderId: string, receiverId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  sendMessage: async (message: {
    sender_id: string
    sender_type: 'therapist' | 'patient'
    receiver_id: string
    receiver_type: 'therapist' | 'patient'
    content: string
  }) => {
    // Insert the message
    const { data, error } = await supabase
      .from('messages')
      .insert(message as any)
      .select()
      .single()
    
    if (!error && data) {
      // Update the conversation's last_message_at
      const therapistId = message.sender_type === 'therapist' ? message.sender_id : message.receiver_id
      const patientId = message.sender_type === 'patient' ? message.sender_id : message.receiver_id
      
      await supabase
        .from('conversations')
        // @ts-expect-error - Supabase generated types issue
        .update({ last_message_at: new Date().toISOString() })
        .eq('therapist_id', therapistId)
        .eq('patient_id', patientId)
    }
    
    return { data, error }
  },

  markAsRead: async (messageId: string) => {
    const { data, error } = await supabase
      .from('messages')
      // @ts-expect-error - Supabase generated types issue with update method
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single()
    return { data, error }
  },

  getUnreadCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false)
    return { count, error }
  },

  createConversation: async (therapistId: string, patientId: string) => {
    // First check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('therapist_id', therapistId)
      .eq('patient_id', patientId)
      .single()
    
    if (existing) {
      return { data: existing, error: null }
    }
    
    // Create new conversation if it doesn't exist
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        therapist_id: therapistId,
        patient_id: patientId
      } as any)
      .select()
      .single()
    return { data, error }
  }
}

// Notification operations
export const notifications = {
  getAll: async (userId: string, userType: 'therapist' | 'patient') => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('user_type', userType)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getUnread: async (userId: string, userType: 'therapist' | 'patient') => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getUnreadCount: async (userId: string, userType: 'therapist' | 'patient') => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('is_read', false)
    return { count, error }
  },

  create: async (notification: {
    user_id: string
    user_type: 'therapist' | 'patient'
    type: 'session_request' | 'session_approved' | 'session_cancelled' | 'session_reminder' | 'message' | 'assessment_due'
    title: string
    message: string
    related_id?: string
  }) => {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification as any)
      .select()
      .single()
    return { data, error }
  },

  markAsRead: async (notificationId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      // @ts-expect-error - Supabase generated types issue
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single()
    return { data, error }
  },

  markAllAsRead: async (userId: string, userType: 'therapist' | 'patient') => {
    const { error } = await supabase
      .from('notifications')
      // @ts-expect-error - Supabase generated types issue
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('is_read', false)
    return { error }
  },

  delete: async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
    return { error }
  }
}

// Assessment operations
export const assessments = {
  getAll: async (patientId?: string) => {
    let query = supabase
      .from('assessments')
      .select(`
        *,
        patient:patients(*),
        therapist:therapists(*)
      `)
      .order('created_at', { ascending: false })
    
    if (patientId) {
      query = query.eq('patient_id', patientId)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        patient:patients(*),
        therapist:therapists(*)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  create: async (assessment: AssessmentInsert) => {
    const { data, error } = await supabase
      .from('assessments')
      .insert(assessment as any)
      .select()
      .single()
    return { data, error }
  },

  getRecent: async (patientId: string, limit: number = 10) => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  }
}
