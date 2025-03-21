import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userName: "",
  password:"",
  image:"",
  email:"",
  friendRequests:[],
  receivedFriendRequests:[],
  friends:[],
  isLoading: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state,action) => {
            state.userName = action.payload;  
    },
    setPassword: (state,action) => {
        state.password = action.payload;  
    },
    setImage: (state,action) => {
      state.image = action.payload;  
    },
    setEmail: (state,action) => {
      state.email = action.payload;  
    },
    addFriendRequestsToArray : (state,action)=>{
      state.friendRequests.push(action.payload)
    },
    setFriendRequests : (state,action)=>{
      state.friendRequests = action.payload;
    },
    removeFriendRequestFromArray: (state, action) => {
      state.friendRequests = state.friendRequests.filter(item => item.email !== action.payload);
    },
    setFriends:(state,action)=>{
      state.friends = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    }
  },
})

export const { setUsername,setImage, setPassword,setEmail,addFriendRequestsToArray,setFriends,setLoading ,removeFriendRequestFromArray,setFriendRequests} = userSlice.actions

export default userSlice.reducer