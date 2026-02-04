import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://loop-backend1.onrender.com", {
  withCredentials: true,
});

export default socket;