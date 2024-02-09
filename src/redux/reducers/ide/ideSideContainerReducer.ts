import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IdeOptionType from "../../../enum/ideOptionType";

// 초기 상태의 타입 정의
interface ideSideContainer {
  open: boolean;
}

// 초기 상태
const initialState: ideSideContainer = {
  open: true,
};

const ideSideContainer = createSlice({
  name: "ideOption",
  initialState,
  reducers: {
    toggleSideContainer: (state) => {
      state.open = !state.open;
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const { toggleSideContainer } = ideSideContainer.actions;
export default ideSideContainer.reducer;
