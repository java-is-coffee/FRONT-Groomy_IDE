import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { FaJava, FaPython, FaJsSquare, FaCuttlefish } from "react-icons/fa";
import { SiKotlin, SiCplusplus } from "react-icons/si";
import {
  NewProject,
  postNewProject,
} from "../../../api/project/postNewProject";
import { patchProjectList } from "../../../api/project/patchProjectList";
import { useDispatch, useSelector } from "react-redux";
import { patchProjects } from "../../../redux/reducers/projectReducer";
import { RootState } from "../../../redux/store/store";
import StackDropdown from "../dropdown/stackDropdown";
import MemberSearchDropdown from "../dropdown/memberSearchDropdown";
import { closeNewProjectModal } from "../../../redux/reducers/modalReducer";
import { toast } from "react-toastify";

import newProjectModalStyles from "./newProjectModal.module.css";
import { IMember } from "../../../api/member/imemberDTO";

const StackOptions = [
  { lang: "JAVASCRIPT", color: "#F7DF1E", icon: <FaJsSquare /> },
  { lang: "C", color: "#A8B9CC", icon: <FaCuttlefish /> },
  { lang: "CPP", color: "#00599C", icon: <SiCplusplus /> },
  { lang: "PYTHON", color: "#3776AB", icon: <FaPython /> },
  { lang: "KOTLIN", color: "#7F52FF", icon: <SiKotlin /> },
  { lang: "JAVA", color: "#F8981C", icon: <FaJava /> },
];

const NewProjectModal = () => {
  const isProjectModalOpen = useSelector(
    (state: RootState) => state.modalState.newProjectModalOpen
  );
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [groupMembers, setGroupMembers] = useState<IMember[]>([]);
  const member = useSelector((state: RootState) => state.member.member);

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
        toast.success("업로드 성공");
        const result = await patchProjectList();
        if (result) {
          dispatch(patchProjects(result));
          dispatch(closeNewProjectModal());
        } else {
          toast.error("접근 권한이 없습니다.");
        }
      } catch (error) {
        toast.error("추가중 오류 발생 다시 시도해주세요");
      }
      dispatch(closeNewProjectModal());
    } else {
      toast.error("세션이 만료되었습니다. 새로고침해주세요");
    }
  };

  const handleSelectLanguage = (language: string) => {
    setSelectedLanguage(language);
  };

  const addProjectMember = (member: IMember) => {
    setGroupMembers((prev: IMember[]) => {
      return [...prev, member];
    });
  };

  const removeProjectMember = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const removeMemberId = target.parentElement?.parentElement?.id;
    setGroupMembers((prev: IMember[]) => {
      return prev.filter(
        (selectedMember) =>
          selectedMember.memberId.toString() !== removeMemberId
      );
    });
  };

  if (!isProjectModalOpen) return null;
  return (
    <div
      className={newProjectModalStyles[`modal-overlay`]}
      onClick={() => dispatch(closeNewProjectModal())}
    >
      <div
        className={newProjectModalStyles[`modal-content`]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={newProjectModalStyles[`modal-header`]}>
          <span>프로젝트 생성하기</span>
          <div
            className={newProjectModalStyles[`modal-close-button`]}
            onClick={() => {
              dispatch(closeNewProjectModal());
            }}
          >
            <RxCross1 width={"32px"} />
          </div>
        </div>
        <div
          className={newProjectModalStyles[`new-project-form`]}
          onSubmit={() => false}
        >
          <label className={newProjectModalStyles[`modal-input-label`]}>
            프로젝트 이름
          </label>
          <input
            className={newProjectModalStyles[`new-project-title`]}
            type="text"
            placeholder="프로젝트 이름을 입력하세요"
            onChange={(e) => setProjectName(e.target.value)}
          />
          <div className={newProjectModalStyles[`modal-input-label`]}>
            기술 스택
          </div>
          <StackDropdown
            stackOptions={StackOptions}
            onSelectStack={handleSelectLanguage}
          />
          <label className={newProjectModalStyles[`modal-input-label`]}>
            프로젝트 설명
          </label>
          <textarea
            className={newProjectModalStyles[`new-project-description`]}
            placeholder="프로젝트에 대한 간단한 설명을 적어주세요(최대 100자)"
            maxLength={100}
            onChange={(e) => setProjectDescription(e.target.value)}
          ></textarea>
          <label className={newProjectModalStyles[`modal-dropdown`]}>
            맴버
          </label>
          <div className={newProjectModalStyles[`member-dropdown`]}>
            <MemberSearchDropdown
              groupMembers={groupMembers}
              onAddMember={addProjectMember}
            />
            <div className={newProjectModalStyles[`members-selected`]}>
              {groupMembers.map((member) => (
                <div
                  key={member.memberId}
                  id={member.memberId.toString()}
                  className={newProjectModalStyles[`group-member`]}
                >
                  <span key={member.memberId}>{member.nickname}</span>
                  <div
                    className={newProjectModalStyles[`member-remove-icons`]}
                    onClick={removeProjectMember}
                  >
                    <IoMdClose size="13px" style={{ cursor: "pointer" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className={newProjectModalStyles[`modal-button`]}
            onClick={handleAddProject}
          >
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewProjectModal;
