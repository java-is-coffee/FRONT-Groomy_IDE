import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

import "../../styles/project/newProjectModal.css";
import { FaJava, FaPython, FaJsSquare, FaCuttlefish } from "react-icons/fa";
import { SiKotlin, SiCplusplus } from "react-icons/si";

import { SearchedMember } from "../../api/member/searchMemberByEmail";
import { NewProject, postNewProject } from "../../api/project/postNewProject";
import { patchProjectList } from "../../api/project/patchProjectList";
import { useDispatch, useSelector } from "react-redux";
import { patchProjects } from "../../redux/reducers/projectReducer";
import { RootState } from "../../redux/store/store";
import StackDropdown from "./dropdown/stackDropdown";
import MemberSearchDropdown from "./dropdown/memberSearchDropdown";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StackOptions = [
  { lang: "JAVASCRIPT", color: "#F7DF1E", icon: <FaJsSquare /> },
  { lang: "C", color: "#A8B9CC", icon: <FaCuttlefish /> },
  { lang: "CPP", color: "#00599C", icon: <SiCplusplus /> },
  { lang: "PYTHON", color: "#3776AB", icon: <FaPython /> },
  { lang: "KOTLIN", color: "#7F52FF", icon: <SiKotlin /> },
  { lang: "JAVA", color: "#F8981C", icon: <FaJava /> },
];

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [groupMembers, setGroupMembers] = useState<SearchedMember[]>([]);
  const member = useSelector((state: RootState) => state.member.member);
  const dispatch = useDispatch();

  // 폼 제출 핸들러
  const handleAddProject = async () => {
    // 폼 제출 로직
    const projectMemberIds: number[] = groupMembers.map(
      (member) => member.memberId
    );
    if (member) {
      const projectDetails: NewProject = {
        projectName: projectName,
        memberId: member.memberId,
        language: selectedLanguage,
        description: projectDescription,
        inviteMembers: projectMemberIds,
      };
      try {
        await postNewProject(projectDetails);
        const result = await patchProjectList();
        if (result) {
          dispatch(patchProjects(result));
        }
      } catch (error) {
        console.error("프로젝트 추가 중 오류 발생:", error);
      }
      onClose();
    } else {
      console.log("세션이 만료되었습니다.");
    }
  };

  const handleSelectLanguage = (language: string) => {
    setSelectedLanguage(language);
  };

  const addProjectMember = (member: SearchedMember) => {
    setGroupMembers((prev: SearchedMember[]) => {
      return [...prev, member];
    });
  };

  const removeProjectMember = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    console.log(target.parentElement);
    const removeMemberId = target.parentElement?.parentElement?.id;
    setGroupMembers((prev: SearchedMember[]) => {
      return prev.filter(
        (selectedMember) =>
          selectedMember.memberId.toString() !== removeMemberId
      );
    });
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>프로젝트 생성하기</span>
          <div className="modal-close-button" onClick={onClose}>
            <RxCross1 width={"32px"} />
          </div>
        </div>
        <div className="new-project-form" onSubmit={() => false}>
          <label className="modal-input-label">프로젝트 이름</label>
          <input
            className="new-project-title"
            type="text"
            placeholder="프로젝트 이름을 입력하세요"
            onChange={(e) => setProjectName(e.target.value)}
          />
          <div className="modal-input-label">기술 스택</div>
          <StackDropdown
            stackOptions={StackOptions}
            onSelectStack={handleSelectLanguage}
          />
          <label className="modal-input-label">프로젝트 설명</label>
          <textarea
            className="new-project-description"
            placeholder="프로젝트에 대한 간단한 설명을 적어주세요(최대 100자)"
            maxLength={100}
            onChange={(e) => setProjectDescription(e.target.value)}
          ></textarea>
          <label className="modal-dropdown">맴버 추가하기</label>
          <div className="member-dropdown">
            <MemberSearchDropdown
              groupMembers={groupMembers}
              onAddMember={addProjectMember}
            />
            <div className="members-selected">
              {groupMembers.map((member) => (
                <div id={member.memberId.toString()} className="group-member">
                  <span key={member.memberId}>{member.nickname}</span>
                  <div
                    className="member-remove-icons"
                    onClick={removeProjectMember}
                  >
                    <IoMdClose size="13px" style={{ cursor: "pointer" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="modal-button" onClick={handleAddProject}>
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewProjectModal;
