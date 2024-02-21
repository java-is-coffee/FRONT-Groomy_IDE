import React, { useEffect, useRef, useState } from "react";
import {
  SearchedMember,
  searchMemberByEmail,
} from "../../../api/member/searchMemberByEmail";

import memberModuleStyles from "./memberSearchDropdown.module.css";

interface DropdownProps {
  groupMembers: SearchedMember[];
  onAddMember: (member: SearchedMember) => void;
}

const MemberSearchDropdown: React.FC<DropdownProps> = ({
  groupMembers,
  onAddMember,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExistingMember, setIsExistingMember] = useState<boolean>(false);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchedMember, setSearchedMember] = useState<SearchedMember | null>();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const addMember = () => {
    if (!isExistingMember) {
      if (searchedMember) {
        onAddMember(searchedMember);
      }
      setSearchEmail("");
      setSearchedMember(null);
      setIsOpen(false);
      setIsExistingMember(false);
    }
  };

  // 드롭 다운 외부 클릭시 닫히게
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchEmail("");
        setSearchedMember(null);
        setIsOpen(false);
        setIsExistingMember(false);
      }
    };

    // mousedown 이벤트는 사용자가 요소 외부를 클릭할 때 발생합니다.
    document.addEventListener("mousedown", handleClickOutside);
    // 클린업 함수로 이벤트 리스너를 제거합니다.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const storedMember: SearchedMember | null = await searchMemberByEmail(
          searchEmail
        );
        setSearchedMember(storedMember);
        console.log(groupMembers);
        groupMembers.map((member) => {
          if (member.memberId === storedMember?.memberId) {
            setIsExistingMember(true);
            return false;
          }
          return true;
        });
      } catch (error) {
        console.log("api error입니다.");
      }
    };
    if (!searchedMember) {
      getMembers();
    }
  }, [searchEmail, groupMembers, searchedMember]);
  return (
    <div
      className={memberModuleStyles[`member-search-container`]}
      ref={dropdownRef}
    >
      {isOpen ? (
        <input
          type="email"
          placeholder="email로 사용자를 검색하세요."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className={memberModuleStyles[`member-search-input`]}
        />
      ) : (
        <button
          className={memberModuleStyles[`member-search-input`]}
          type="button"
          onClick={() => setIsOpen(true)}
        >
          email로 사용자를 검색하세요.
        </button>
      )}
      {isOpen && (
        <div className={memberModuleStyles[`member-search-result`]}>
          {searchedMember ? (
            <div
              className={memberModuleStyles[`member-search-item`]}
              onClick={addMember}
            >
              <div className={memberModuleStyles[`member-search-email`]}>
                {searchedMember.email}
              </div>
              <div className={memberModuleStyles[`member-search-name`]}>
                {searchedMember.nickname}
              </div>
              <div className={memberModuleStyles[`member-selected`]}>
                {isExistingMember ? "이미 추가된 사용자입니다." : ""}
              </div>
            </div>
          ) : (
            <div className={memberModuleStyles[`member-search-no-result`]}>
              {`"${searchEmail}"은 존재하지 않는 사용자입니다.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberSearchDropdown;
