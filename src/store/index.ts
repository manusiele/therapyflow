import { configureStore } from '@reduxjs/toolkit'
import therapistReducer from './slices/therapistSlice'
import sessionReducer from './slices/sessionSlice'
import patientReducer from './slices/patientSlice'

export const store = configureStore({
  reducer: {
    therapist: therapistReducer,
    session: sessionReducer,
    patient: patientReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
