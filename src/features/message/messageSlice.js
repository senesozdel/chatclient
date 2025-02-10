import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allMessages:[],
  transmittedMessage:{
    sender:"",
    receivers:[],
    content:"",
    sendTime:"",
    key:"",
    status:false
  },
  receivedMessage:{
    sender:"",
    receivers:[],
    content:"",
    sendTime:"",
    key:"",
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
    setAllMessages :(state,action) =>{
      state.allMessages.unshift(...action.payload);
    },
    addTransmittedMessageReceiver:(state,action)=>{
      state.transmittedMessage.receivers.push(action.payload)
    },
    clearTransmittedMessage: (state) => {
      const { sender, receivers } = state.transmittedMessage; 
      state.transmittedMessage = {
        sender,
        receivers,
        content: "",
        sendTime: "",
        status: false
      };
    }
    
}})

// Action creators are generated for each case reducer function
export const { setTransmittedMessage,setReceivedMessage,addMessageToArray,addTransmittedMessageReceiver,setAllMessages,clearTransmittedMessage} = messageSlice.actions

export default messageSlice.reducer