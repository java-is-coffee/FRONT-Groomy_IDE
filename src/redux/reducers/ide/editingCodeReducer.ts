import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface CodeDetails {
  id: string;
  name: string;
  lang: string;
  content: string; // 파일일 경우의 내용 (선택적)
}

interface CodeState {
  editingCode: CodeDetails;
  codeTabs: CodeDetails[];
}

// 초기 상태의 타입 정의
const initialState: CodeState = {
  editingCode: {
    id: "",
    name: "",
    lang: "",
    content: "",
  },
  codeTabs: [],
};

const curEditingCode = createSlice({
  name: "editingCode",
  initialState,
  reducers: {
    // 현재 수정중인 파일 설정
    setCurEditingCode: (state, action: PayloadAction<CodeDetails>) => {
      state.editingCode = action.payload;
      sessionStorage.setItem("curCode", JSON.stringify(action.payload));
    },
    // 새로 선택된 파일 코드 탭에 추가
    addCodeTab: (state, action: PayloadAction<CodeDetails>) => {
      const isExist = state.codeTabs.some(
        (tab) => tab.id === action.payload.id
      );
      if (!isExist) {
        state.codeTabs.push(action.payload);
      }
    },
    // 닫힌 코드 탭 삭제
    removeCodeTab: (state, action: PayloadAction<string>) => {
      const filteredCodeTabs = state.codeTabs.filter(
        (code) => code.id !== action.payload
      );

      state.codeTabs = filteredCodeTabs;
      if (state.editingCode.id === action.payload) {
        // 첫 번째 탭을 현재 편집 중인 코드로 설정
        if (state.codeTabs.length > 0) {
          state.editingCode = filteredCodeTabs[0];
        } else {
          state.editingCode = initialState.editingCode;
        }
      }
    },
    // 수정된 코드 저장
    saveCode: (state, action: PayloadAction<CodeDetails>) => {
      state.codeTabs = state.codeTabs.map((code) =>
        code.id === action.payload.id ? action.payload : code
      );
      state.editingCode = action.payload;
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const { setCurEditingCode, addCodeTab, removeCodeTab, saveCode } =
  curEditingCode.actions;
export default curEditingCode.reducer;
