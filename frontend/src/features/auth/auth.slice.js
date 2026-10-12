import { createSlice } from "@reduxjs/toolkit";

// auth slice of state
const initialState = {
   loading: true,
   user: null,
   accessToken: null,
   error: null,
};

// Export #1: the whole slice object - (export usually for debugging or testing)
export const authSlice = createSlice({
   name: "auth",  // name can be anything. It's work is only to identify the slice in the store and in the action types, it should be unique across the app, and it is used to generate action types like auth/setUser, auth/setAccessToken, etc. It's work is only for identification purpose (in devtools).
   initialState, // reducer isi initalState ko update karta hai at dispatch moment
   reducers: {
      setLoading: (state, action) => {
         state.loading = action.payload;
      },
      setUser: (state, action) => {
         state.user = action.payload;
      },
      setAccessToken: (state, action) => {
         state.accessToken = action.payload;
      },
      setError: (state, action) => {
         state.error = action.payload;
      },
   },
   // actions.payload ye hota hai jo dispatch ke time pass kiya jata hai, aur ye reducer ke andar state ko update karne ke liye use hota hai. Ye action creators automatically generate hote hain based on the reducers defined in the slice.
});

export const { setLoading, setUser, setAccessToken, setError } = authSlice.actions; // Export #2: action creators - (export in hook)

export default authSlice.reducer; // Export #3: the reducer function - (export in store)
