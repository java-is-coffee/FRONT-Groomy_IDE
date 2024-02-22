import React, { useState, useRef, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeProjects } from "../../../redux/reducers/projectReducer";
import { deleteProject } from "../../../api/project/deleteProject";

import projectCardDropdownStyles from "./projectCardDropdown.module.css";
import {
  openEditProjectModal,
  openInviteProjectModal,
} from "../../../redux/reducers/modalReducer";
import { ProjectDetails } from "../../../api/project/patchProjectList";

interface ProjectCardDropdownProps {
  projectDetails: ProjectDetails;
}

const ProjectCardDropdown: React.FC<ProjectCardDropdownProps> = ({
  projectDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const dispatchProjectRemoval = () => {
    dispatch(removeProjects(projectDetails.projectId));
  };

  const requestProjectDeletion = async () => {
    try {
      const result = await deleteProject(projectDetails.projectId);
      if (result) {
        dispatchProjectRemoval();
      }
    } catch (error) {
      console.log("프로젝트 삭제에 실패했습니다.");
    }
  };
  // 외부 클릭을 감지하기 위한 함수
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLDivElement;
      if (ref.current && !ref.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // ref는 불변이므로 의존성 배열에 넣지 않습니다.

  return (
    <div
      className={projectCardDropdownStyles[`project-card-dropdown`]}
      ref={ref}
    >
      <button onClick={() => setIsOpen(!isOpen)}>
        <MdMoreHoriz size={"20px"} color="#646E7D" />
      </button>
      {isOpen && (
        <div
          className={projectCardDropdownStyles[`project-card-dropdown-menu`]}
        >
          <button
            onClick={() => {
              dispatch(openInviteProjectModal(projectDetails));
              setIsOpen(false);
            }}
          >
            INVITE
          </button>
          <button
            onClick={() => {
              dispatch(openEditProjectModal(projectDetails));
              setIsOpen(false);
            }}
          >
            EDIT
          </button>
          <button onClick={requestProjectDeletion}>REMOVE</button>
        </div>
      )}
    </div>
  );
};

export default ProjectCardDropdown;
