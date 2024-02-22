// projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CommentDetails } from "../../api/board/getCommentList";

// 초기 상태의 타입 정의
interface BoardStaus {
  boardList: BoardDetails[] | null;
  content: BoardDetails | null;
  page: number[] | null;
  maxPage: number | null;
  contentId: number | null;
  currentPage: number | null;
  pageOffset: number | null;
  commentList: CommentDetails[] | null;
  comment: CommentDetails | null;
  isEdited: boolean;
  isSearch: boolean;
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
  comment: CommentDetails;
  completed: boolean;
  memberScrapped: boolean;
}

// 초기 상태
const initialState: BoardStaus = {
  boardList: null,
  content: null,
  page: null, // 페이지 리스트
  maxPage: null, // 최대 몇페이지 있는지
  contentId: null,
  currentPage: null, //현재 페이지가 몇페이지 인지 나타냄
  pageOffset: null, // 현재 몇페이지 까지 offset인지. (페이지 넘길때 필요)
  commentList: null,
  comment: null,
  isEdited: false,
  isSearch: false,
};

const BoardReducer = createSlice({
  name: "boards",
  initialState,
  reducers: {
    patchBoardList: (state, action: PayloadAction<BoardDetails[] | null>) => {
      state.boardList = action.payload;
    },
    patchPage: (state, action: PayloadAction<number[] | null>) => {
      state.page = action.payload;
    },
    patchMaxPage: (state, action: PayloadAction<number>) => {
      state.maxPage = action.payload;
    },
    patchContentId: (state, action: PayloadAction<number>) => {
      state.contentId = action.payload;
    },
    patchContent: (state, action: PayloadAction<BoardDetails | null>) => {
      state.content = action.payload;
    },
    patchIsEdited: (state, action: PayloadAction<boolean>) => {
      state.isEdited = action.payload;
    },
    patchPageOffset: (state, action: PayloadAction<number>) => {
      state.pageOffset = action.payload;
    },
    patchCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    patchCommentList: (
      state,
      action: PayloadAction<CommentDetails[] | null>
    ) => {
      state.commentList = action.payload;
    },
    patchComment: (state, action: PayloadAction<CommentDetails | null>) => {
      state.comment = action.payload;
    },
    patchIsSeacrh: (state, action: PayloadAction<boolean>) => {
      state.isSearch = action.payload;
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const {
  patchBoardList,
  patchPage,
  patchMaxPage,
  patchContentId,
  patchContent,
  patchCurrentPage,
  patchPageOffset,
  patchIsEdited,
  patchCommentList,
  patchComment,
  patchIsSeacrh,
} = BoardReducer.actions;
export default BoardReducer.reducer;
