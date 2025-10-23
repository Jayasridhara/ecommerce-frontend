import axios from "axios";


// const baseURL = "http://localhost:5000/api/v1";
const baseURL = "https://ecommerce-backend-1-ldht.onrender.com/api/v1";
//add changes
const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;