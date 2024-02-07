import React, { useState, useRef, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";
import "../../../styles/project/dropdown/projectCardDropdown.css";
import { useDispatch } from "react-redux";
import { removeProjects } from "../../../redux/reducers/projectReducer";
import { deleteProject } from "../../../api/project/deleteProject";

interface ProjectCardDropdownProps {
  projectId: number;
}

const ProjectCardDropdown: React.FC<ProjectCardDropdownProps> = ({
  projectId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const dispatchProjectRemoval = () => {
    dispatch(removeProjects(projectId));
  };

  const requestProjectDeletion = async () => {
    try {
      const result = await deleteProject(projectId);
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
    <div className="project-card-dropdown" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <MdMoreHoriz size={"20px"} color="#646E7D" />
      </button>
      {isOpen && (
        <div className="project-card-dropdown-menu">
          {/* 프로젝트 수정 페이지 구현 예정 */}
          <button onClick={() => console.log("Edit")}>Edit</button>
          <button onClick={requestProjectDeletion}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProjectCardDropdown;
