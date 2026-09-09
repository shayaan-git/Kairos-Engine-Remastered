import { Server } from "socket.io";
import { configs } from "../src/config/config.js";

let io;
export function initSocket(httpServer) {
   io = new Server(httpServer, {
      cors: {
         origin: "http://localhost:5173" || configs.CORS_ORIGIN,
         credentials: true,
      },
   });

   console.log("Socket Server is running online");

   io.on("connection", (socket) => {
      console.log("A user connected " + socket.id); // unique socket id - never change - until user gets reconnects
   });
}

export function getIO() {
   if (!io) {
      throw new Error("Socket io failed to initialized");
   }
   return io;
}
