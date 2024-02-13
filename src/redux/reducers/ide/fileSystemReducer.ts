import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string; // 파일일 경우의 내용 (선택적)
  children?: FileItem[]; // 폴더일 경우 자식 아이템을 포함할 수 있음 (선택적)
}

// 스토어의 상태 타입 정의
interface FileSystemState {
  fileSystem: FileItem[];
}

// 초기 상태
const initialState: FileSystemState = {
  fileSystem: [],
};

interface IaddFile {
  item: FileItem;
  parentId: string;
}

// 재귀로 파일 내에 있는 파일 검색후 수정하는 메서드
const updateItem = (item: FileItem, payload: FileItem): FileItem => {
  if (item.id === payload.id) {
    return payload;
  } else if (item.type === "folder" && item.children) {
    return {
      ...item,
      children: item.children.map((child) => updateItem(child, payload)),
    };
  } else {
    return item;
  }
};

const fileSystem = createSlice({
  name: "fileSystem",
  initialState,
  reducers: {
    // 파일 추가
    addItem: (state, action: PayloadAction<FileItem>) => {
      state.fileSystem.push(action.payload);
    },
    // 지정된 폴더에 파일 추가
    addItemToFolder: (state, action: PayloadAction<IaddFile>) => {
      const { parentId, item } = action.payload;

      const addItem = (items: FileItem[]): FileItem[] => {
        return items.map((folder) => {
          if (folder.id === parentId && folder.type === "folder") {
            return { ...folder, children: [...(folder.children || []), item] };
          } else if (folder.children) {
            return { ...folder, children: addItem(folder.children) };
          } else {
            return folder;
          }
        });
      };

      state.fileSystem = addItem(state.fileSystem);
    },
    // 파일 삭제 임시 구현 수정 필요
    removeItem: (state, action: PayloadAction<string>) => {
      state.fileSystem = state.fileSystem.filter(
        (item) => item.id !== action.payload
      );
    },
    // 처음으로 탐색기에 파일 구조 적용
    setItems: (state, action: PayloadAction<FileItem[]>) => {
      state.fileSystem = action.payload;
    },
    // update 메서드를 활용해서 파일 수정된 부분 저장
    saveItem: (state, action: PayloadAction<FileItem>) => {
      state.fileSystem = state.fileSystem.map((item) =>
        updateItem(item, action.payload)
      );
    },
  },
});

// 액션 생성자와 리듀서 내보내기
export const { addItem, addItemToFolder, removeItem, setItems, saveItem } =
  fileSystem.actions;
export default fileSystem.reducer;
