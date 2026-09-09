import app from "./src/app.js";
import http from "http";
import { initSocket } from "./sockets/server.socket.js";
import connectToDB from "./src/config/db.js";

const startServer = async () => {
   try {
      const httpServer = http.createServer(app);

      initSocket(httpServer);

      console.log("Connecting to Database and Backend Server...");
      await connectToDB();

      httpServer.listen(3000, () => {
         console.log(`Backend Server is running on http://localhost:3000`);
      });
   } catch (err) {
      console.error("Something is wrong with connecting to server", err);
      process.exit(1);
   }
};

startServer();
