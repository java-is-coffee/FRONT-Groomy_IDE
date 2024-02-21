import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ContentType } from "../../enum/mainOptionType";

// 초기 상태의 타입 정의
interface contentTypeState {
  option: ContentType;
}

// 초기 상태
const initialState: contentTypeState = {
  option: ContentType.ProjectList,
};

const mainOption = createSlice({
  name: "mainOption",
  initialState,
  reducers: {
    setMainOption: (state, action: PayloadAction<ContentType>) => {
      state.option = action.payload;
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const { setMainOption } = mainOption.actions;
export default mainOption.reducer;
