import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IdeOptionType from "../../../enum/ideOptionType";

// 초기 상태의 타입 정의
interface ideOptionState {
  option: IdeOptionType;
}

// 초기 상태
const initialState: ideOptionState = {
  option: IdeOptionType.File,
};

const ideOption = createSlice({
  name: "ideOption",
  initialState,
  reducers: {
    setIdeOption: (state, action: PayloadAction<IdeOptionType>) => {
      state.option = action.payload;
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const { setIdeOption } = ideOption.actions;
export default ideOption.reducer;
