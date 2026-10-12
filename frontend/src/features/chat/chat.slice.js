import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   chats: {}, // contain all messages
   currentChatId: null, // current active chat
   isLoading: false,
   error: null,
};

export const chatSlice = createSlice({
   name: "chats",
   initialState,
   reducers: {
      setChats: (state, action) => {
         state.chats = action.payload;
      },
      setCurrentChatId: (state, action) => {
         state.currentChatId = action.payload;
      },
      setLoading: (state, action) => {
         state.isLoading = action.payload;
      },
      setError: (state, action) => {
         state.error = action.payload;
      },
   },
});

export const { setLoading, setError, setCurrentChatId, setChats } =
   chatSlice.actions;

export default chatSlice.reducer;
