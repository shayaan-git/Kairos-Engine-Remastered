import { io } from "socket.io-client";

export function initializeSocketConnection() {
   const socket = io(
      "http://localhost:3000" || `${import.meta.env.VITE_API_URL}`,
      { withCredentials: true },
   );

   socket.on("connect", () => {
      console.log("Connected to Socket io Server");
   });
}
