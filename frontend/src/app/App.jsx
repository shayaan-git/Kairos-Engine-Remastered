import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "../features/chat/pages/Dashboard.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import { setLoading, setUser } from "../features/auth/auth.slice.js";
import { useAuth } from "../features/auth/hook/use.auth.js";
import { useDispatch } from "react-redux";
import NotFoundPage from "../utils/NotFoundPage.jsx";

const App = () => {
   const dispatch = useDispatch();
   const { handleRefreshToken, handleGetMe } = useAuth();

   useEffect(() => {
      async function fetchUser() {
         try {
            dispatch(setLoading(true));
            await handleRefreshToken();
            await handleGetMe();
         } catch (err) {
            dispatch(setUser(null));
         }
      }
      fetchUser(); 
   }, []);

   return (
      <Routes>
         <Route
            path="/"
            element={
               <Protected>
                  <Dashboard />
               </Protected>
            }
         />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="*" element={<NotFoundPage/>} />
      </Routes>
   );
};

export default App;
