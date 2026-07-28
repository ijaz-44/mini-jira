import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // For HttpOnly Cookies / JWT
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Axios Response / Error Interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;