import { useState } from "react";
import { FileItem } from "../redux/reducers/ide/fileSystemReducer";

const useTree = () => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileItem | null>(null);

  // 폴더 선택 핸들러
  const handleFolderSelected = (folder: FileItem | null) => {
    setSelectedFolder((prev) => {
      if (prev === folder) {
        return null;
      } else {
        return folder;
      }
    });
  };

  // 노드 토글 핸들러
  const handleNodeToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    event.stopPropagation();
    setExpanded(nodeIds);
  };

  const handleNodeSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelectedList(nodeIds);
  };

  // 특정 노드를 확장하는 함수
  const openNode = (nodeId: string) => {
    if (!expanded.includes(nodeId)) {
      setExpanded((prev) => [...prev, nodeId]);
    }
  };

  return {
    expanded,
    selectedFolder,
    handleFolderSelected,
    handleNodeToggle,
    selectedList,
    setSelectedList,
    handleNodeSelect,
    openNode,
  };
};

export default useTree;
