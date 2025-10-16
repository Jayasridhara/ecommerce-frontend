import axios from "axios";

const baseURL = "http://localhost:5000/api/v1";
//  const baseURL = "https://ecommerce-backend-1-ldht.onrender.com/api/v1";

const protectedInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // use cookies (httpOnly token set by backend)
});

// No Authorization header attached here because token is stored in cookie (httpOnly)

// on auth errors, inform the app to clear auth state and redirect
// protectedInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       // can't remove httpOnly cookies from client; backend should provide a logout endpoint
//       // notify app to clear client-side auth state
//       window.dispatchEvent(new CustomEvent("auth:logout"));
//       if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default protectedInstance;