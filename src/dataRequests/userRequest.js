import axios from "axios";
import Cookies from "js-cookie";

export const addNewUser = async (payload) => {
    const url = "https://localhost:7288/api/User";
  
    try {
      await axios.post(url, payload);
      return true; 
    } catch (error) {
      console.error('Error adding new user:', error);
      return false; 
    }
  };

  export const login = async (payload) => {
    const url = "https://localhost:7288/api/Auth/login";

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
  const url = "https://localhost:7288/api/UserRelationShip";
    try {
      await axios.post(url, payload);
      return true; 
    } catch (error) {
      console.error('Error adding new user:', error);
      return false; 
    }
}  ;

export const createNewRelationRequests = async ( payload) =>{
  const url = "https://localhost:7288/api/UserRelationRequests";
    try {
      await axios.post(url, payload);
      return true; 
    } catch (error) {
      console.error('Error creating new request:', error);
      return false; 
    }
}  ;

  export const getFriends = async (param )=>{
    const url = `https://localhost:7288/api/User/friends/${param}`;
  
    try {
      var result = await axios.get(url);
      return result; 
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }

  export const getFriendRequests = async (param )=>{
    const url = `https://localhost:7288/api/UserRelationRequests/?email=${param}`;
  
    try {
      var result = await axios.get(url);
      return result; 
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }

  export const deleteFriendRequests = async (payload )=>{
    const url = `https://localhost:7288/api/UserRelationRequests`;
  
    try {
      var result = await axios.delete(url,{
        data: payload
      });
      return result; 
    } catch (error) {
      console.error('Error deleting requests:', error);
    }
  }