// store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "../reducers/projectReducer"; // projectsSlice.ts에서 정의한 리듀서를 가져옵니다.
import memberReducer from "../reducers/memberReducer";
import boardReducer from "../reducers/boardReducer";
import ideOptionReducer from "../reducers/ide/ideOptionReducer";
import ideSideContainerReducer from "../reducers/ide/ideSideContainerReducer";
import fileSystemReducer from "../reducers/ide/fileSystemReducer";
import editingCodeReducer from "../reducers/ide/editingCodeReducer";

export const store = configureStore({
  reducer: {
    projects: projectsReducer, // projects 슬라이스의 리듀서를 스토어에 등록합니다.
    member: memberReducer,
    board: boardReducer,
    ideOption: ideOptionReducer,
    ideSideContainer: ideSideContainerReducer,
    fileSystem: fileSystemReducer,
    editingCode: editingCodeReducer,
  },
});

// RootState 타입을 정의하여, 스토어의 상태 타입을 추론할 수 있도록 합니다.
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch 타입을 정의하여, 스토어의 dispatch 함수 타입을 설정합니다.
export type AppDispatch = typeof store.dispatch;
