import { configureStore } from '@reduxjs/toolkit'
import farmerReducer from './slices/farmerSlice'
import marketReducer from './slices/marketSlice'

export const store = configureStore({
  reducer: {
    farmer: farmerReducer,
    market: marketReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
