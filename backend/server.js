import app from "./src/app.js";
import connectToDB from "./src/config/db.js";

const startServer = async () => {
   try {
      console.log('Connecting to Database and Backend Server...')
      await connectToDB();

      app.listen(3000, () => {
         console.log(`Server is running on http://localhost:3000`);
      });
   } catch (err) {
      console.error("Something is wrong with connecting to server", err);
      process.exit(1);
   }
};

startServer();
