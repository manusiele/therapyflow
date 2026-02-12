import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MarketPrice {
  id: string
  crop_type: string
  price: number
  date: string
  location: string
}

interface MarketState {
  prices: MarketPrice[]
  loading: boolean
}

const initialState: MarketState = {
  prices: [],
  loading: false,
}

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setPrices: (state, action: PayloadAction<MarketPrice[]>) => {
      state.prices = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setPrices, setLoading } = marketSlice.actions
export default marketSlice.reducer
