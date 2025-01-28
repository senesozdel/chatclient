import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isConnected: false,
}

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnectionState: (state,action) => {
            state.isConnected = action.payload;  
    }

}})

export const { setConnectionState} = connectionSlice.actions

export default connectionSlice.reducer