import axios from "axios";


const baseURL = "https://ecommerce-backend-1bs1.onrender.com/api/v1";

const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;