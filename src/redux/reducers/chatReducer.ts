
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatLog } from "../../api/chat/fetchChatLogs";

interface ChatState {
  chat: ChatLog[] | null; 
}

const initialState: ChatState = {
  chat: null, 
};


const chatReducer = createSlice({
  name: "chat",
  initialState,
  reducers: {
    patchChat(state, action: PayloadAction<ChatLog[]>) {
      state.chat = action.payload; // Update chat directly
    },
    removeChat(state, action: PayloadAction<number>) {
      if (state.chat) { // Handle missing chat gracefully
        state.chat = state.chat.filter((chat) => chat.id !== action.payload);
      }
    },
  },
});

export const { patchChat, removeChat } = chatReducer.actions;
export default chatReducer.reducer;