import axios from "axios";
// const baseURL = "http://localhost:5000/api/v1";

const baseURL = "https://ecommerce-backend-1-ldht.onrender.com/api/v1";
//server instance
const protectedInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",

  },
  withCredentials: true, // use cookies (httpOnly token set by backend)
});

protectedInstance.interceptors.request.use(
  (config) => { 
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  
  }
    return config;
  }

);


export default protectedInstance;