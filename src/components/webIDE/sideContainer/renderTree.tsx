import { TreeItem, TreeView } from "@mui/x-tree-view";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import {
  addItem,
  addItemToFolder,
  FileItem,
} from "../../../redux/reducers/ide/fileSystemReducer";
import getLanguageIcon, { getLangExtension } from "../codeEditor/language";
import { useState } from "react";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import NewItemInput from "../codeEditor/newFile";
import {
  CodeDetails,
  addCodeTab,
  setCurEditingCode,
} from "../../../redux/reducers/ide/editingCodeReducer";

const RenderTree = () => {
  const [expanded, setExpanded] = useState<string[]>([]); // 확장된 노드의 ID 목록
  const [inputValue, setInputValue] = useState("");
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userFiles = useSelector(
    (state: RootState) => state.fileSystem.fileSystem
  );

  // 파일 추가 취소 메서드
  const onCancel = () => {
    setIsAddingFile(false);
    setIsAddingFolder(false);
    setInputValue("");
  };

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

  // 선택된 폴더 핸들러
  const handleFolderSelected = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  // 폴더 선택시 토글 되었는지 안되었는지 확인하는 메서드
  const handleNodeToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
    // 선택된 폴더가 닫히면 입력 필드 비활성화
    if (selectedFolderId && !nodeIds.includes(selectedFolderId)) {
      onCancel();
      setSelectedFolderId(null); // 선택된 폴더 ID 초기화
    }
  };

  // 펼쳐진 폴더 추가
  const openNode = () => {
    if (selectedFolderId && !expanded.includes(selectedFolderId)) {
      setExpanded((prev) => [...prev, selectedFolderId]);
    }
  };

  // 새로운 폴더 & 파일 생성 input value 가져오기
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // 버튼이 클릭된 경우 생성 input 랜더링
  const renderNewItemInput = () => {
    return (
      (isAddingFile || isAddingFolder) && (
        <NewItemInput
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          type={isAddingFile ? "file" : "folder"}
          handleConfirm={handleConfirm}
          onCancel={onCancel}
        />
      )
    );
  };

  // 파일구조 material tree 사용해서 랜더링하기
  // 폴더인 경우 재귀를 통해서 랜더링
  const renderTree = (items: FileItem) => {
    return items.type === "folder" ? (
      <TreeItem
        key={items.id}
        nodeId={items.id}
        label={items.name}
        onClick={() => handleFolderSelected(items.id)}
      >
        {items.children && items.children.map((node) => renderTree(node))}
        {items.id === selectedFolderId && renderNewItemInput()}
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

  // edit 할 파일 선택시 code space에 추가
  const handleFileEditing = (items: FileItem) => {
    const file: string[] = items.name.split(".");
    const editingCode: CodeDetails = {
      id: items.id,
      name: items.name,
      lang: getLangExtension(file[1]),
      content: items.content ? items.content : "",
    };
    dispatch(setCurEditingCode(editingCode));
    dispatch(addCodeTab(editingCode));
    // api 패치 추가예정
  };

  // 새로운 document submit 핸들러
  const handleConfirm = (type: string) => {
    const newItem: FileItem =
      type === "file"
        ? {
            id: Date.now().toString(),
            name: inputValue === "" ? "new-file" : inputValue,
            type: "file",
            content: "empty file",
          }
        : {
            id: Date.now().toString(),
            name: inputValue === "" ? "new-folder" : inputValue,
            type: "folder",
            children: [],
          };
    if (selectedFolderId === null) {
      dispatch(addItem(newItem));
    } else {
      const itemInfo = {
        item: newItem,
        parentId: selectedFolderId,
      };
      dispatch(addItemToFolder(itemInfo));
    }
    onCancel();
  };

  return (
    <div>
      <div className="explore-options">
        <span className="project-name">DEV</span>
        <div className="explore-tools">
          <div
            className="explore-tools-icon"
            onClick={() => {
              setIsAddingFile(true);
              openNode();
            }}
          >
            <VscNewFile size={"17px"} />
          </div>
          <div
            className="explore-tools-icon"
            onClick={() => {
              setIsAddingFolder(true);
              openNode();
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
        {userFiles.map(renderTree)}
      </TreeView>
    </div>
  );
};

export default RenderTree;
