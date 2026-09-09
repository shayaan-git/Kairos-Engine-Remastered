import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat.js";

const Dashboard = () => {
   const chat = useChat();

   const { user } = useSelector((state) => state.auth);

   console.log("user:", user);

   useEffect(() => {
      chat.initializeSocketConnection()
   }, []);

   return (
      <div>
         <h1>Dashboard</h1>
      </div>
   );
};

export default Dashboard;
