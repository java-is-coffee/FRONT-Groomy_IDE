// projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommentDetails } from "../../api/board/patchCommentList";

// 초기 상태의 타입 정의
interface BoardStaus {
  boards: BoardDetails[] | null;
  content: BoardDetails | null;
  page: number[] | null;
  maxPage: number | null;
  contentId: number | null;
  currentPage: number | null;
  pageOffset: number | null;
  commentList: CommentDetails[] | null;
}

export interface BoardDetails {
  boardId: number;
  memberId: number;
  title: string;
  nickname: string;
  content: string;
  viewNumber: number;
  commentNumber: number;
  scrapNumber: number;
  createdTime: string;
  helpNumber: number;
  isCompleted: boolean;
}

// 초기 상태
const initialState: BoardStaus = {
  boards: null,
  content: null,
  page: null, // 페이지 리스트
  maxPage: null, // 최대 몇페이지 있는지
  contentId: null,
  currentPage: null, //현재 페이지가 몇페이지 인지 나타냄
  pageOffset: null, // 현재 몇페이지 까지 offset인지. (페이지 넘길때 필요)
  commentList: null,
};

const BoardReducer = createSlice({
  name: "boards",
  initialState,
  reducers: {
    patchBoard: (state, action: PayloadAction<BoardDetails[]>) => {
      state.boards = action.payload;
    },
    patchPage: (state, action: PayloadAction<number[]>) => {
      state.page = action.payload;
    },
    patchMaxPage: (state, action: PayloadAction<number>) => {
      state.maxPage = action.payload;
    },
    patchContentId: (state, action: PayloadAction<number>) => {
      state.contentId = action.payload;
    },
    patchContent: (state, action: PayloadAction<BoardDetails>) => {
      state.content = action.payload;
    },
    patchPageOffset: (state, action: PayloadAction<number>) => {
      state.pageOffset = action.payload;
    },
    patchCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    patchComment: (state, action: PayloadAction<CommentDetails[]>) => {
      state.commentList = action.payload;
    },
    removeBoard: (state, action: PayloadAction<number>) => {
      if (state.boards) {
        state.boards = state.boards.filter(
          (board) => board.boardId !== action.payload
        );
      }
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const {
  patchBoard,
  removeBoard,
  patchPage,
  patchMaxPage,
  patchContentId,
  patchContent,
  patchCurrentPage,
  patchPageOffset,
  patchComment,
} = BoardReducer.actions;
export default BoardReducer.reducer;
