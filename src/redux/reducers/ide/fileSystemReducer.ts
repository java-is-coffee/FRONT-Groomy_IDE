import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: "FILE" | "FOLDER";
  lastUpdatedTime?: string;
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

interface FileResponse {
  itemId?: string;
  name: string;
  path: string;
  content: string;
  type: string;
  children: [];
  action: "CREATE" | "RENAME" | "DELETE";
}

// 재귀로 파일 내에 있는 파일 검색후 수정하는 메서드
const updateItem = (item: FileItem, payload: FileItem): FileItem => {
  if (item.id === payload.id) {
    return payload;
  } else if (item.type === "FOLDER" && item.children) {
    return {
      ...item,
      children: item.children.map((child) => updateItem(child, payload)),
    };
  } else {
    return item;
  }
};

const deleteItemRecursive = (items: FileItem[], itemId: string): FileItem[] => {
  return items
    .map((item) => {
      // 자식 아이템이 있는 경우 재귀적으로 처리
      if (item.children) {
        return {
          ...item,
          children: deleteItemRecursive(item.children, itemId),
        };
      }
      return item;
    })
    .filter((item) => item.id !== itemId); // 삭제하려는 아이템 필터링
};

// const findItemById = (
//   items: FileItem[],
//   itemId: string
// ): FileItem | undefined => {
//   for (const item of items) {
//     if (item.id === itemId) {
//       return item; // 찾은 아이템 반환
//     } else if (item.children) {
//       const found = findItemById(item.children, itemId);
//       if (found) return found; // 하위에서 찾은 아이템 반환
//     }
//   }
//   return undefined; // 아이템을 찾지 못한 경우
// };

const fileSystem = createSlice({
  name: "fileSystem",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<FileResponse>) => {
      const { itemId, name, path, type } = action.payload;
      const filePath = path.split("/").filter((segment) => segment !== "");
      const parentIndex = filePath.length - 2;
      if (!itemId) return;
      const newItem: FileItem =
        type === "FILE"
          ? {
              id: itemId,
              name: name,
              path: path,
              type: "FILE",
              lastUpdatedTime: "",
            }
          : {
              id: itemId,
              name: name,
              path: path,
              type: "FOLDER",
              lastUpdatedTime: "",
              children: [],
            };
      // 최상위에 항목 추가
      if (parentIndex < 0) {
        state.fileSystem.push(newItem);
        return;
      }

      // 부모 폴더 찾기 및 항목 추가
      const parentName = filePath[parentIndex];
      const addItemToParent = (items: FileItem[]): FileItem[] => {
        return items.map((item) => {
          if (item.name === parentName && item.type === "FOLDER") {
            // 부모 폴더에 새 항목 추가
            return {
              ...item,
              children: [...(item.children || []), newItem],
            };
          } else if (item.children) {
            // 하위 폴더 탐색
            return { ...item, children: addItemToParent(item.children) };
          } else {
            // 변경 없음
            return item;
          }
        });
      };

      // 파일 시스템 업데이트
      state.fileSystem = addItemToParent(state.fileSystem);
    },

    // 파일 이름 변경
    renameItem: (state, action: PayloadAction<FileResponse>) => {
      const { path, name } = action.payload;
      const segments = path.split("/").filter(Boolean); // 경로를 분석합니다.
      const parentPathSegments = segments.slice(0, -1); // 부모 경로의 세그먼트
      const newPath = [...parentPathSegments, name].join("/"); // 새로운 경로

      const updateItemPath = (item: FileItem, basePath: string): FileItem => ({
        ...item,
        path: `${basePath}/${item.name}`,
        children: item.children
          ? item.children.map((child) =>
              updateItemPath(child, `${basePath}/${item.name}`)
            )
          : [],
      });

      console.log(segments);
      console.log(parentPathSegments);
      console.log(newPath);
      const findAndUpdateItem = (
        items: FileItem[],
        pathSegments: string[],
        currentPath: string[]
      ): FileItem[] =>
        items.map((item) => {
          if (pathSegments.length === 1 && item.name === pathSegments[0]) {
            // 경로의 마지막 부분에 도달했고, 현재 항목의 이름이 경로와 일치한다면 이름과 경로를 변경합니다.
            const updatedItem = { ...item, name: name, path: newPath };
            console.log("catch rename File" + updateItem.name);
            return updateItemPath(updatedItem, newPath);
          } else if (
            item.children &&
            pathSegments.length > 0 &&
            item.name === pathSegments[0]
          ) {
            // 현재 항목이 경로의 다음 부분과 일치하고 자식 항목이 있다면 재귀적으로 탐색을 계속합니다.
            return {
              ...item,
              children: findAndUpdateItem(
                item.children,
                pathSegments.slice(1),
                [...currentPath, item.name]
              ),
            };
          }
          return item; // 일치하지 않으면 원본 항목을 반환합니다.
        });

      const updateItems: FileItem[] = findAndUpdateItem(
        state.fileSystem,
        segments,
        []
      );
      state.fileSystem = updateItems;
    },
    // 파일 삭제 임시 구현 수정 필요
    deleteItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.fileSystem = deleteItemRecursive(state.fileSystem, itemId);
    },
    // 처음으로 탐색기에 파일 구조 적용
    setItems: (state, action: PayloadAction<FileItem[]>) => {
      state.fileSystem = action.payload;
    },
    // 프로젝트 퇴장시 모두 리섹
    resetItems: (state, action: PayloadAction) => {
      state = initialState;
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
export const {
  addItem,
  resetItems,
  deleteItem,
  renameItem,
  setItems,
  saveItem,
} = fileSystem.actions;
export default fileSystem.reducer;
