import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allMessages:[],
  transmittedMessage:{
    sender:"",
    receivers:[],
    content:"",
    sendTime:"",
    status:false
  },
  receivedMessage:{
    sender:"",
    receivers:[],
    content:"",
    sendTime:"",
    status:false
  }
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {

    setTransmittedMessage: (state, action) => {
      state.transmittedMessage = { ...state.transmittedMessage, ...action.payload };
    },
    setReceivedMessage: (state, action) => {
      state.receivedMessage = { ...state.receivedMessage, ...action.payload };
    },
    addMessageToArray: (state, action) => {
      state.allMessages.push(action.payload);
    },
    addTransmittedMessageReceiver:(state,action)=>{
      state.transmittedMessage.receivers.push(action.payload)
    }
    
}})

// Action creators are generated for each case reducer function
export const { setTransmittedMessage,setReceivedMessage,addMessageToArray,addTransmittedMessageReceiver} = messageSlice.actions

export default messageSlice.reducer