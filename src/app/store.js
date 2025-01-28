import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from '../features/user/userSlice'
import  connectionReducer from '../features/connection/connectionSlice'
import messageReducer from '../features/message/messageSlice';
export const store = configureStore({
  reducer: {
    user : userReducer,
    connection : connectionReducer,
    message : messageReducer
  },
})