// projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MemberInfo } from "../../api/auth/getMemberInfo";

// 초기 상태의 타입 정의
interface MemberState {
  member: MemberInfo | null;
}

// 초기 상태
const initialState: MemberState = {
  member: null,
};

const memberReducer = createSlice({
  name: "Member",
  initialState,
  reducers: {
    setMember: (state, action: PayloadAction<MemberInfo | null>) => {
      state.member = action.payload;
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const { setMember } = memberReducer.actions;
export default memberReducer.reducer;
