
import { useEffect, useState } from 'react';
import './App.css';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {addMessageToArray, setReceivedMessage } from './features/message/messageSlice';
import Register from './pages/Register';
import UserSettings from './pages/UserSetttings';
import * as signalR from '@microsoft/signalr'
import { addFriendRequestsToArray } from './features/user/userSlice';
import Deneme from './pages/Deneme';
import Layout from './components/Layout';
import { Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
function App() {

  const [hubConnection, setHubConnection] = useState(null)

  const dispatch = useDispatch();
  const connectionSlice = useSelector((state) => state.connection)
  const messageSlice = useSelector((state)=>state.message)
  const userSlice = useSelector((state)=>state.user)

  useEffect(()=>{
  if(connectionSlice.isConnected){
    const newConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7288/chathub")
    .withAutomaticReconnect()
    .build();


    newConnection.start().then(() => {console.log("bağlı") ; setHubConnection(newConnection);})
    .catch(() => console.log("bağlanamadı"));

  }
  },[connectionSlice.isConnected])


  useEffect(() => {
    if (hubConnection) {

      hubConnection.invoke("OnConnected",userSlice.userName).catch(error =>console.log(error))
    
      hubConnection.on("receiveMessage",  (message) => {
         dispatch(setReceivedMessage(message))
         dispatch(addMessageToArray(message))

      })

      hubConnection.on("receiveAddFriendReuqest",  (message) => {
        console.log(message);
        dispatch(addFriendRequestsToArray(message))
      })

    }
  }, [hubConnection, dispatch])


//   useEffect(() => {
//     if (hubConnection) {
//       dispatch(addMessageToArray(messageSlice.receivedMessage))
// console.log(messageSlice.receivedMessage)

//     }
//   }, [hubConnection, dispatch,messageSlice.receivedMessage])


  return (
    <>
<BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login hubConnection={hubConnection} />} />
        <Route path="/register" element={<Register hubConnection={hubConnection} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<Chat hubConnection={hubConnection} />} />
            <Route path="/userSettings" element={<UserSettings hubConnection={hubConnection} />} />
            <Route path="/deneme" element={<Deneme hubConnection={hubConnection} />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
