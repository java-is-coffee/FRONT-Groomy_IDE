import React, { ReactElement, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import styles from "../../../styles/project/dropdown/stackDropdown.module.css";

interface Option {
  lang: string;
  color: string;
  icon: ReactElement;
}

interface StackDropdownProps {
  stackOptions: Option[];
  onSelectStack: (stack: string) => void;
}

const StackDropdown: React.FC<StackDropdownProps> = ({
  stackOptions,
  onSelectStack,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 드롭 다운 외부 클릭시 닫히게
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // mousedown 이벤트는 사용자가 요소 외부를 클릭할 때 발생합니다.
    document.addEventListener("mousedown", handleClickOutside);
    // 클린업 함수로 이벤트 리스너를 제거합니다.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles["dropdown-button"]}
        onClick={toggleDropdown}
        type="button"
      >
        {selectedOption ? (
          <div className={styles["stack-container"]}>
            <div
              className={styles["stack-icon"]}
              style={{ color: "white", backgroundColor: selectedOption.color }}
            >
              {selectedOption.icon}
            </div>
            <span>{selectedOption.lang}</span>
          </div>
        ) : (
          "스택을 선택하세요"
        )}
        <span className={styles["dropdown-arrow"]}>
          {isOpen ? (
            <IoIosArrowUp size={"20px"} />
          ) : (
            <IoIosArrowDown size={"20px"} />
          )}
        </span>
      </button>
      {isOpen && (
        <ul className={styles["dropdown-menu"]}>
          {stackOptions.map((option) => (
            <div
              key={option.lang}
              className={styles["stack-item-container"]}
              onClick={() => {
                handleOptionClick(option);
                onSelectStack(option.lang);
              }}
            >
              <div
                className={styles["stack-icon"]}
                style={{ color: "white", backgroundColor: option.color }}
              >
                {option.icon}
              </div>
              <span>{option.lang}</span>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StackDropdown;
