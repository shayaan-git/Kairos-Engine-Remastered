import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/use.auth.js";
import Dashboard from "../features/chat/pages/Dashboard.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";

const App = () => {
   const { handleGetMe } = useAuth();

   useEffect(() => {
      handleGetMe();
   }, []);

   return (
      <Routes>
         <Route path="/" element={<Dashboard />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
      </Routes>
   );
};

export default App;
