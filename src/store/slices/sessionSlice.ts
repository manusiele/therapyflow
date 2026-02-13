import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Session {
  id: string
  patient_id: string
  therapist_id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  session_type: string
}

interface SessionState {
  sessions: Session[]
  loading: boolean
}

const initialState: SessionState = {
  sessions: [],
  loading: false,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setSessions, addSession, setLoading } = sessionSlice.actions
export default sessionSlice.reducer
