// projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Stomp, { Client } from "stompjs";

interface ISocket {
  socketConnect: boolean ;
}

// 초기 상태
const initialState: ISocket = {
  socketConnect: false,
};

const socketReducer = createSlice({
  name: "Member",
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<boolean>) => {
      state.socketConnect = action.payload;
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const { setSocket } = socketReducer.actions;
export default socketReducer.reducer;
