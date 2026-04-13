//frontend/src/api/axios.js
import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "/api");

const instance = axios.create({
  baseURL,
});

//This interceptor runs before EVERY request.
//It reads the token from localStorage and adds it to the Authorization header.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default instance;
