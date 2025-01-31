import axios from "axios";
import { URL } from "../../config";
const API_URL = URL + "/api/users/";

//register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};
// login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData, {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};
// logout user
const logout = async () => {
  const response = await axios.get(API_URL + "logout", {
    withCredentials: true,
  });
  return response.data;
};

// get user
const getUser = async () => {
  const response = await axios.get(API_URL + "me", {
    withCredentials: true,
  });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getUser,
};
export default authService;
