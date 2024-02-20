import { TreeItem, TreeView } from "@mui/x-tree-view";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import {
  FileItem,
  addItem,
  deleteItem,
  renameItem,
  setItems,
} from "../../../redux/reducers/ide/fileSystemReducer";
import getLanguageIcon, { getLangExtension } from "../codeEditor/language";
import { useCallback, useEffect, useRef, useState } from "react";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import NewItemInput from "../codeEditor/newFile";
import {
  CodeDetails,
  addCodeTab,
  setCurEditingCode,
} from "../../../redux/reducers/ide/editingCodeReducer";
import { getFileTree } from "../../../api/codeFile/getFileTree";

import { useParams } from "react-router-dom";
import useTree from "../../../hooks/useTree";
import useWebSocket from "../../../hooks/useWebSocket";
import { Input } from "@mui/material";
import { TiDocumentDelete } from "react-icons/ti";
import { CgRename } from "react-icons/cg";
import { FaFolder } from "react-icons/fa";
import { FaRegFolderOpen } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoSyncSharp } from "react-icons/io5";
import { getFileContent } from "../../../api/codeFile/getFileContent";

// 언어에 맞는 로고 가져오기
const setLabel = (name: string) => {
  const source: string[] = name.split(".");
  const icon = getLanguageIcon(source[1]);
  return <div className="code-icon">{icon}</div>;
};

// 소켓 통신에 필요한 dto
interface FileDTO {
  data: FileResponse;
}

interface FileResponse {
  itemId?: string;
  name: string;
  path: string;
  content: string;
  type: string;
  children: [];
  action: "CREATE" | "RENAME" | "DELETE";
}

const RenderTree = () => {
  const { projectId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [isAddingFile, setIsAddingFile] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const treeViewRef = useRef<HTMLDivElement>(null);
  const userFiles = useSelector(
    (state: RootState) => state.fileSystem.fileSystem
  );
  const {
    expanded,
    selectedFolder,
    handleFolderSelected,
    handleNodeToggle,
    selectedList,
    setSelectedList,
    handleNodeSelect,
    openNode,
  } = useTree(); // 커스텀 훅 사용

  const { stompClient, connect, subscribe, unsubscribe, sendMessage } =
    useWebSocket();

  // 파일 추가 취소 메서드
  const onCancel = useCallback(() => {
    setIsAddingFile("");
    setInputValue("");
  }, []);

  // 새로운 폴더 & 파일 생성 input value 가져오기
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // 버튼이 클릭된 경우 생성 input 랜더링
  const renderNewItemInput = () => {
    return (
      isAddingFile !== "" && (
        <NewItemInput
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          type={isAddingFile}
          handleConfirm={handleConfirm}
          onCancel={onCancel}
        />
      )
    );
  };

  // 파일 트리에서 id로 아이템 탐색
  const findItemById = useCallback(
    (items: FileItem[], itemId: string): FileItem | undefined => {
      for (const item of items) {
        if (item.id === itemId) {
          return item; // 찾은 아이템 반환
        } else if (item.children) {
          const found = findItemById(item.children, itemId);
          if (found) return found; // 하위에서 찾은 아이템 반환
        }
      }
      return undefined; // 아이템을 찾지 못한 경우
    },
    []
  );

  // 아이템 삭제시에 웹소켓으로 메세지 전송
  const handleDeleteItem = useCallback(() => {
    selectedList.forEach((nodeId) => {
      const itemToDelete = findItemById(userFiles, nodeId);
      if (itemToDelete) {
        const message: FileDTO = {
          data: {
            name: itemToDelete.name,
            path: itemToDelete.path,
            content: "",
            type: itemToDelete.type,
            children: [],
            action: "DELETE",
          },
        };
        sendMessage(`/app/project-file/${projectId}/send`, message);
      }
    });
    // 선택된 노드 상태를 초기화합니다.
    setSelectedList([]);
  }, [
    findItemById,
    projectId,
    selectedList,
    sendMessage,
    setSelectedList,
    userFiles,
  ]);

  // 새로운 파일 생성 요청시 웹소켓 통신으로 서버에 전송
  const handleConfirm = useCallback(
    (type: string) => {
      const message: FileDTO = {
        data: {
          name: inputValue,
          path: `${
            selectedFolder === null ? "" : selectedFolder.path
          }/${inputValue}`,
          content: "",
          type: type,
          children: [],
          action: "CREATE",
        },
      };
      sendMessage(`/app/project-file/${projectId}/send`, message);
      onCancel();
    },
    [inputValue, selectedFolder, projectId, sendMessage, onCancel]
  );

  // 이름 재구성 요청시에 웹소켓 통신
  const handleRenameConfirm = useCallback(
    (itemId: string) => {
      const renameItem = findItemById(userFiles, itemId);
      if (renameItem) {
        const message: FileDTO = {
          data: {
            name: inputValue,
            path: renameItem.path,
            content: "",
            type: renameItem.type,
            children: [],
            action: "RENAME",
          },
        };
        sendMessage(`/app/project-file/${projectId}/send`, message);
        setInputValue("");
        setEditingItemId(null);
      }
    },
    [inputValue, userFiles, projectId, sendMessage, findItemById]
  );

  // delete 키로 삭제 & 트리 바깥 클릭시에 폴더 상태 초기화
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        handleDeleteItem();
      }
    };
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        treeViewRef.current &&
        !treeViewRef.current.contains(event.target as Node)
      ) {
        handleFolderSelected(null); // 선택된 폴더 상태 초기화
      }
    };
    // 전체 문서에 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [projectId, handleFolderSelected, handleDeleteItem]);

  // 파일구조 material tree 사용해서 랜더링하기
  // 폴더인 경우 재귀를 통해서 랜더링
  const renderTree = (items: FileItem[]) => {
    // 먼저 파일과 폴더를 분리합니다.
    const files = items.filter((item) => item.type === "FILE");
    const folders = items.filter((item) => item.type === "FOLDER");

    // 파일을 먼저 정렬하고 그 다음에 폴더를 정렬합니다.
    const sortedItems = [...folders, ...files];
    return sortedItems.map((item) => (
      <TreeItem
        key={item.id}
        nodeId={item.id}
        icon={item.type === "FILE" ? setLabel(item.name) : ""}
        label={
          editingItemId === item.id ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                size="small"
                value={inputValue}
                placeholder={item.name}
                onChange={handleInputChange}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameConfirm(item.id);
                    e.preventDefault();
                  }
                }}
                style={{
                  fontSize: "14px", // 글꼴 크기를 줄입니다.
                }}
              />
              <RxCross2
                onClick={() => {
                  setInputValue("");
                  setEditingItemId(null);
                }}
              />
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {item.name}
              {selectedList.includes(item.id) ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TiDocumentDelete
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem();
                    }}
                  />
                  <CgRename
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 전파를 멈춥니다.
                      setEditingItemId(item.id);
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )
        }
        onClick={() => {
          item.type === "FOLDER"
            ? handleFolderSelected(item)
            : handleFileEditing(item);
        }}
      >
        {item.children && renderTree(item.children)}
        {item.id === selectedFolder?.id && renderNewItemInput()}
      </TreeItem>
    ));
  };

  // 파일에 대한 내용 서버로부터 받아오기
  const fetchFileContent = async (oldPath: string) => {
    try {
      if (!projectId) throw new Error("Project ID가 없습니다.");
      const result = await getFileContent(projectId, oldPath);
      return result || ""; // result가 undefined 또는 null일 경우 빈 문자열 반환
    } catch (error) {
      console.error("코드 세부 정보 불러오기 오류:", error);
      return ""; // 오류가 발생했을 경우 빈 문자열 반환
    }
  };

  // edit 할 파일 선택시 code space에 추가
  const handleFileEditing = async (items: FileItem) => {
    const file: string[] = items.name.split(".");
    const content = await fetchFileContent(items.path);
    const editingCode: CodeDetails = {
      id: items.id,
      name: items.name,
      path: items.path,
      lang: getLangExtension(file[1]),
      content: content,
    };
    dispatch(setCurEditingCode(editingCode));
    dispatch(addCodeTab(editingCode));
  };

  // 마운트시에 파일 트리 정보 서버로부터 받아오기
  useEffect(() => {
    const fetchFileTree = async () => {
      if (projectId) {
        try {
          const result = await getFileTree(projectId);
          if (result) {
            dispatch(setItems(result));
          }
        } catch (error) {
          // 에러 핸들링 추가
          console.error("Failed to load project file tree:", error);
        }
      }
    };
    fetchFileTree();
  }, [projectId, dispatch]);

  // 구독된 주소로부터 받은 메세지 처리
  useEffect(() => {
    if (!stompClient) {
      console.log("code editor connection");
      connect("ws/project");
    }

    const subDestination = `/projectws/${projectId}/files`;

    subscribe(subDestination, (message) => {
      // 메시지에 대한 처리 로직
      const data: FileResponse = JSON.parse(message.body);
      if (!data.itemId) return;
      switch (data.action) {
        case "CREATE":
          dispatch(addItem(data));
          break;
        case "DELETE":
          dispatch(deleteItem(data.itemId));
          break;
        case "RENAME":
          dispatch(renameItem(data));
          break;
      }
    });

    return () => {
      unsubscribe(subDestination);
    };
  }, [stompClient, projectId, connect, subscribe, unsubscribe, dispatch]);

  return (
    <div ref={treeViewRef}>
      <div className="explore-options">
        <span className="project-name">DEV</span>
        <div className="explore-tools">
          <div
            className="explore-tools-icon"
            id="file-sync-icon"
            onClick={() => {
              const syncFileSystem = async () => {
                if (projectId) {
                  const syncFiles: FileItem[] | null = await getFileTree(
                    projectId
                  );
                  if (syncFiles) {
                    dispatch(setItems(syncFiles));
                  }
                }
              };
              syncFileSystem();
            }}
          >
            <IoSyncSharp size={"17px"} />
          </div>
          <div
            className="explore-tools-icon"
            onClick={() => {
              setIsAddingFile("FILE");
              if (selectedFolder) {
                openNode(selectedFolder.id);
              }
            }}
          >
            <VscNewFile size={"17px"} />
          </div>
          <div
            className="explore-tools-icon"
            onClick={() => {
              setIsAddingFile("FOLDER");
              if (selectedFolder) {
                openNode(selectedFolder.id);
              }
            }}
          >
            <VscNewFolder size={"17px"} />
          </div>
        </div>
      </div>
      <div>
        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<FaRegFolderOpen color="#FFCB28" />}
          defaultExpandIcon={<FaFolder color="#FFCB28" />}
          expanded={expanded}
          multiSelect={true}
          onNodeSelect={handleNodeSelect}
          onNodeToggle={handleNodeToggle}
          sx={{
            fontFamily: "Consolas",
            fontWeight: "lighter", // TreeView 전체의 폰트 무게를 bold로 설정
            fontSize: "1rem",
            "& .MuiTreeItem-label": {
              fontFamily: "Consolas", // TreeItem 라벨의 폰트 패밀리를 Arial로 설정
              fontSize: "1rem", // TreeItem 라벨의 폰트 크기를 1rem으로 설정
            },
          }}
        >
          {renderTree(userFiles)}
          {selectedFolder ? "" : renderNewItemInput()}
        </TreeView>
      </div>
    </div>
  );
};

export default RenderTree;
