import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice.js";

export const store = configureStore({
   reducer: {
      auth: authReducer, // iska use karke state access karte hain - YE [auth: authReducer] hai wo hi key ko kuch aise likhte hain useSelector() ke saath -> state.auth.user -> Aur yahan (state.auth = initalState)
   },
});
