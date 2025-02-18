import axios from "axios";
import { APP_CONFIG } from "../config/config";

const BASE_URL = APP_CONFIG.API_URL;

export const sendBackup = async ( payload) =>{
  const url = `${BASE_URL}/Message/CreateMulti` ;

    try {
      await axios.post(url, payload);
      return true; 
    } catch (error) {
      console.error('Error adding new user:', error);
      return false; 
    }
}  ;