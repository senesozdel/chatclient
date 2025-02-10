import axios from "axios";
import Cookies from "js-cookie";
import { APP_CONFIG } from "../config/config";

const BASE_URL = APP_CONFIG.API_URL;

export const addNewUser = async (payload) => {
    const url = `${BASE_URL}/api/User`;
  
    try {
      await axios.post(url, payload);
      return true; 
    } catch (error) {
      console.error('Error adding new user:', error);
      return false; 
    }
  };

  export const login = async (payload) => {
    const url = `${BASE_URL}/api/Auth/login` ;

    try {
    const result = await axios.post(url, payload);
    const token = result.data.token;
    const userInfos = result.data.user;
    Cookies.set('token', token, { expires: 1, path: '' });
    Cookies.set('user', JSON.stringify(userInfos), { expires: 1, path: '' });
      return true; 
    } catch (error) {
      console.error('Error login:', error);
      return false; 
    }
  };

export const addNewRelation = async ( payload) =>{
  const url = `${BASE_URL}/CreateUserRelationship`
    try {
      await axios.post(url, payload);
      return true; 
    } catch (error) {
      console.error('Error adding new user:', error);
      return false; 
    }
}  ;

export const createNewRelationRequests = async ( payload) =>{
  const url = `${BASE_URL}/api/UserRelationRequests`

    try {
      await axios.post(url, payload);
      return true; 
    } catch (error) {
      console.error('Error creating new request:', error);
      return false; 
    }
}  ;

  export const getFriends = async (param )=>{
    const url = `${BASE_URL}/api/User/friends/${param}`

    try {
      var result = await axios.get(url);
      return result; 
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }

  export const getFriendRequests = async (param )=>{
    const url = `${BASE_URL}/api/UserRelationRequests/?email=${param}`;
  
    try {
      var result = await axios.get(url);
      return result; 
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }

  export const deleteFriendRequests = async (payload )=>{
    const url = `${BASE_URL}/api/UserRelationRequests`;
  
    try {
      var result = await axios.delete(url,{
        data: payload
      });
      return result; 
    } catch (error) {
      console.error('Error deleting requests:', error);
    }
  }