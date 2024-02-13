import { TreeItem } from "@mui/x-tree-view";
import { Input } from "@mui/material";
import { useEffect, useRef } from "react";

interface NewItemInputProps {
  inputValue: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  handleConfirm: (type: string) => void;
  onCancel: () => void;
}

const NewItemInput = ({
  inputValue,
  handleInputChange,
  type,
  handleConfirm,
  onCancel,
}: NewItemInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 입력 필드 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // event.target이 Node의 인스턴스임을 단언합니다.
      const target = event.target as Node;

      if (inputRef.current && !inputRef.current.contains(target)) {
        onCancel(); // 입력 필드 외부 클릭 시 onCancel 콜백 호출
      }
    };

    // 페이지에 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 클린업 함수에서 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);
  return (
    <TreeItem
      nodeId="input"
      label={
        <Input
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Enter ${type} name`}
          style={{ fontSize: "14px" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleConfirm(type);
            }
          }}
        />
      }
    />
  );
};

export default NewItemInput;
