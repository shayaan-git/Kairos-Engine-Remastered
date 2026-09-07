import { useDispatch } from "react-redux";
import {
   setAccessToken,
   setError,
   setLoading,
   setUser,
} from "../auth.slice.js";
import {
   getMe,
   login,
   logout,
   logoutAll,
   refreshToken,
   register,
} from "../service/auth.api.js";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   async function handleRegister({ username, email, password }) {
      try {
         dispatch(setLoading(true));

         await register({ username, email, password }); // email notification ke through registration kar rahe
      } catch (err) {
         dispatch(
            setError(err.response?.data?.message || "Registration Failed"),
         );
      } finally {
         dispatch(setLoading(false));
      }
   }

   async function handleLogin({ email, password }) {
      try {
         dispatch(setLoading(true));
         const data = await login({ email, password });
         dispatch(setUser(data?.user));
         dispatch(setAccessToken(data?.accessToken));
      } catch (err) {
         dispatch(setError(err.response?.data?.message || "login Failed"));
      } finally {
         dispatch(setLoading(false));
      }
   }

   async function handleRefreshToken() {
      try {
         dispatch(setLoading(true));
         const data = await refreshToken();
         dispatch(setAccessToken(data?.accessToken));
      } catch (err) {
         dispatch(
            setError(
               err.response?.data?.message ||
                  err?.name ||
                  "Refresh Token Failed",
            ),
         );
      } finally {
         dispatch(setLoading(false));
      }
   }

   async function handleGetMe() {
      try {
         dispatch(setLoading(true));
         const data = await getMe();
         dispatch(setUser(data?.user));
      } catch (err) {
         dispatch(
            setError(err.response?.data?.message || "Fetching User Failed"),
         );
      } finally {
         dispatch(setLoading(false));
      }
   }

   async function handleLogout() {
      try {
         dispatch(setLoading(true));
         await logout();
      } catch (err) {
         dispatch(setError(err.response?.data?.message || "Logout Failed"));
      } finally {
         dispatch(setUser(null));
         dispatch(setLoading(false));
         navigate("/login");
      }
   }

   async function handleLogoutAll() {
      try {
         dispatch(setLoading(true));
         await logoutAll();
      } catch (err) {
         dispatch(
            setError(
               err.response?.data?.message || "Logout from all devices failed",
            ),
         );
      } finally {
         dispatch(setLoading(false));
      }
   }

   return {
      handleRegister,
      handleLogin,
      handleRefreshToken,
      handleGetMe,
      handleLogout,
      handleLogoutAll,
   };
};
