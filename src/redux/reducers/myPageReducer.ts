import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardDetails } from "./boardReducer";
import { CommentDetails } from "../../api/board/getCommentList";

export interface MyPageStatus {
  myBoardList: BoardDetails[] | null;
  scrappedBoardList: BoardDetails[] | null;
  MyCommentList: CommentDetails[] | null;
  isBack: boolean;
}

const initialState: MyPageStatus = {
  myBoardList: null,
  scrappedBoardList: null,
  MyCommentList: null,
  isBack: false,
};

const MyPageReducer = createSlice({
  name: "myPage",
  initialState: initialState,
  reducers: {
    patchMyBoardList: (state, action: PayloadAction<BoardDetails[] | null>) => {
      state.myBoardList = action.payload;
    },
    patchScrappedList: (
      state,
      action: PayloadAction<BoardDetails[] | null>
    ) => {
      state.scrappedBoardList = action.payload;
    },
    patchMyCommentList: (
      state,
      action: PayloadAction<CommentDetails[] | null>
    ) => {
      state.MyCommentList = action.payload;
    },
    setBackLog: (state, action: PayloadAction<boolean>) => {
      state.isBack = action.payload;
    },
  },
});

export const {
  patchMyBoardList,
  patchScrappedList,
  patchMyCommentList,
  setBackLog,
} = MyPageReducer.actions;
export default MyPageReducer.reducer;
