import axios from "axios";

export const sendBackup = async ( payload) =>{
  const url = "https://localhost:7288/CreateMulti";
    try {
      await axios.post(url, payload);
      return true; 
    } catch (error) {
      console.error('Error adding new user:', error);
      return false; 
    }
}  ;