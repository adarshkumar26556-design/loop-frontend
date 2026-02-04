import { io } from "socket.io-client";

const socket = io("https://loop-backend1.onrender.com", {
  withCredentials: true,
});

export default socket;