//frontend/src/api/axios.js
import axios from "axios";

const backendUrl =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:5000";
const normalizedBackendUrl = backendUrl
  .replace(/\/$/, "")
  .replace(/\/api$/, "");
const apiBaseUrl = `${normalizedBackendUrl}/api`;

const instance = axios.create({
  baseURL: apiBaseUrl,
});

//This interceptor runs before EVERY request.
//It reads the token from localStorage and adds it to the Authorization header.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default instance;
