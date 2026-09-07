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
   name: "auth",
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
});

export const { setLoading, setUser, setAccessToken, setError } = authSlice.actions; // Export #2: action creators - (export in hook)

export default authSlice.reducer; // Export #3: the reducer function - (export in store)
