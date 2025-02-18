
import { useEffect, useRef, useState } from 'react';
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
import Layout from './components/Layout';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { message } from 'antd';
import Cookies from "js-cookie";
import { messageBackup } from './utils/messageBackup';
import Settings from './pages/Settings';
import { APP_CONFIG } from "../src/config/config";

function App() {

  const [hubConnection, setHubConnection] = useState(null)

  const dispatch = useDispatch();
  const connectionSlice = useSelector((state) => state.connection)
  const messageSlice = useSelector((state)=>state.message)
  const userSlice = useSelector((state)=>state.user)
  const userCookie = Cookies.get('user');
  const loggedUser = userCookie ? JSON.parse(userCookie) : null;
  const messagesRef = useRef(messageSlice.allMessages);
  const BASE_URL = APP_CONFIG.API_URL;
  

  useEffect(() => {
    messagesRef.current = messageSlice.allMessages;
  }, [messageSlice.allMessages]);

  useEffect(()=>{
  if(connectionSlice.isConnected){
    const newConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/chathub`)
    .withAutomaticReconnect()
    .build();


    newConnection.start().then(() => {console.log("bağlı") ; setHubConnection(newConnection);})
    .catch(() => console.log("bağlanamadı"));

  }
  },[connectionSlice.isConnected])

  useEffect(()=>{



          hubConnection?.on("clientJoined",  (username) => {

        if(loggedUser?.username != username){
          message.info(`${username} huba bağlandı`)
          console.log(`${username} huba bağlandı`)
        }
      })


  },[hubConnection])


  useEffect(() => {
    if (hubConnection) {

      hubConnection.invoke("OnConnected",userSlice.userName).catch(error =>console.log(error))

    
      hubConnection.on("receiveMessage",  (receiveMessage) => {
        try {
        if(receiveMessage.status){
          dispatch(setReceivedMessage(receiveMessage))
          dispatch(addMessageToArray(receiveMessage))
        }
        else{
          message.error("Alıcı Hub'a Bağlı Değil")
        }

      } catch (error) {
          console.error("Mesaj işlenirken hata:", error);
      }

      })

      hubConnection.on("receiveAddFriendReuqest",  (message) => {
        dispatch(addFriendRequestsToArray(message))
      })

      hubConnection.on("takeBackup",  (value) => {

        if(value){
          messageBackup(messagesRef.current)
        }

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
            <Route path="/settings" element={<Settings hubConnection={hubConnection} />} />
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
