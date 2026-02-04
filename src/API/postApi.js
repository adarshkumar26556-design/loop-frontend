import axios from "axios";

const postAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://loop-backend1.onrender.com/api"}/posts`,
});

postAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default postAPI;
