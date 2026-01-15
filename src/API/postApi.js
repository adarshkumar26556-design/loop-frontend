// src/api/postApi.js
import axios from "axios";

const postAPI = axios.create({
  baseURL: "http://localhost:3000/api/posts",
});

postAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default postAPI;
