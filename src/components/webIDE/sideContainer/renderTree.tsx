import { TreeItem, TreeView } from "@mui/x-tree-view";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import {
  FileItem,
  setItems,
} from "../../../redux/reducers/ide/fileSystemReducer";
import getLanguageIcon, { getLangExtension } from "../codeEditor/language";
import { useEffect, useState } from "react";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import NewItemInput from "../codeEditor/newFile";
import {
  CodeDetails,
  addCodeTab,
  setCurEditingCode,
} from "../../../redux/reducers/ide/editingCodeReducer";
import { getFileTree } from "../../../api/\bfile/getFileTree";
import { useParams } from "react-router-dom";
import useTree from "../../../hooks/useTree";
import { getFileContent } from "../../../api/\bfile/getFileContent";

// 언어에 맞는 로고 가져오기
const setLabel = (name: string) => {
  const source: string[] = name.split(".");
  const icon = getLanguageIcon(source[1]);
  return (
    <div className="code-details">
      <div className="code-icon">{icon}</div>
      <div className="code-title">{name}</div>
    </div>
  );
};

const RenderTree = () => {
  const { projectId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [isAddingFile, setIsAddingFile] = useState("");
  const dispatch = useDispatch();
  const userFiles = useSelector(
    (state: RootState) => state.fileSystem.fileSystem
  );
  const {
    expanded,
    selectedFolder,
    handleFolderSelected,
    handleNodeToggle,
    openNode,
  } = useTree(); // 커스텀 훅 사용

  // 파일 추가 취소 메서드
  const onCancel = () => {
    setIsAddingFile("");
    setInputValue("");
  };

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

  // 파일구조 material tree 사용해서 랜더링하기
  // 폴더인 경우 재귀를 통해서 랜더링
  const renderTree = (items: FileItem) => {
    return items.type === "FOLDER" ? (
      <TreeItem
        key={items.id}
        nodeId={items.id}
        label={items.name}
        onClick={() => handleFolderSelected(items)}
      >
        {items.children && items.children.map(renderTree)}
        {items.id === selectedFolder?.id && renderNewItemInput()}
      </TreeItem>
    ) : (
      <TreeItem
        key={items.id}
        nodeId={items.id}
        label={setLabel(items.name)}
        onClick={() => handleFileEditing(items)}
      ></TreeItem>
    );
  };

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
    // api 불러오기
    const content = await fetchFileContent(items.path);
    const editingCode: CodeDetails = {
      id: items.id,
      name: items.name,
      lang: getLangExtension(file[1]),
      content: content,
    };
    console.log(editingCode);
    dispatch(setCurEditingCode(editingCode));
    dispatch(addCodeTab(editingCode));
  };

  // 새로운 document submit 핸들러
  const handleConfirm = (type: string) => {
    // 프로젝트 생성 request 처리
    onCancel();
  };

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
  return (
    <div>
      <div className="explore-options">
        <span className="project-name">DEV</span>
        <div className="explore-tools">
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
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        expanded={expanded}
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
        {userFiles.map((items) => renderTree(items))}
        {selectedFolder ? "" : renderNewItemInput()}
      </TreeView>
    </div>
  );
};

export default RenderTree;
