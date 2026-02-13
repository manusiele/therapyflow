import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Patient {
  id: string
  name: string
  email: string
  therapist_id: string
  date_of_birth?: string
}

interface PatientState {
  patients: Patient[]
  currentPatient: Patient | null
  loading: boolean
}

const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  loading: false,
}

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload
    },
    setCurrentPatient: (state, action: PayloadAction<Patient>) => {
      state.currentPatient = action.payload
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setPatients, setCurrentPatient, addPatient, setLoading } = patientSlice.actions
export default patientSlice.reducer