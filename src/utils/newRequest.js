import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


// Base URL setup
const baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api'  // Development URL
  : process.env.BACKEND_URL;  // Production URL


console.log("🚀 ~ baseURL:", baseURL)
console.log("🚀 ~ process.env.NODE_ENV:", process.env.NODE_ENV)
console.log("🚀 ~ process.env.BACKEND_URL:", process.env.BACKEND_URL)


// Create an Axios instance
const newRequest = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json' // Commonly needed header for API requests
  }
});

// Add a response interceptor
newRequest.interceptors.response.use(
  response => response, // For successful responses, just return the response
  error => {
    // Handle errors
    // toast.error('API Error');

    console.error('API Error:', error.response);
    return Promise.reject(error); // Forward error to be handled where the request was made
  }
);

export default newRequest;
