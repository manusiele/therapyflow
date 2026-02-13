import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Therapist {
  id: string
  name: string
  email: string
  specialization: string
  license_number?: string
}

interface TherapistState {
  currentTherapist: Therapist | null
  loading: boolean
}

const initialState: TherapistState = {
  currentTherapist: null,
  loading: false,
}

const therapistSlice = createSlice({
  name: 'therapist',
  initialState,
  reducers: {
    setTherapist: (state, action: PayloadAction<Therapist>) => {
      state.currentTherapist = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setTherapist, setLoading } = therapistSlice.actions
export default therapistSlice.reducer
