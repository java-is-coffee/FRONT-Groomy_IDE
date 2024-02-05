import React from "react";
import { RiSettings4Fill } from "react-icons/ri";
import { MdOutlineMoreHoriz } from "react-icons/md";

import "../../styles/home/projectCard.css";

type projectProps = {
  projectDetails: {
    projectId: number;
    memberId: number;
    projectName: string;
    description: string;
    language: string;
    createdTime: string;
    deleted: boolean;
    projectPath: string;
  };
};

enum LangColor {
  JavaScript = "#F7DF1E",
  C = "#A8B9CC",
  Cpp = "#00599C",
  Python = "#3776AB",
  Kotlin = "#7F52FF",
  Java = "#F8981C",
}

const ProjectCard: React.FC<projectProps> = ({ projectDetails }) => {
  const color =
    LangColor[projectDetails.language as keyof typeof LangColor] || "white";
  return (
    <div className="project-card" id={projectDetails.projectId.toString()}>
      <div className="project-header">
        <span className="project-title">{projectDetails.projectName}</span>
        <div className="tools">
          <RiSettings4Fill size={"28px"} />
          <MdOutlineMoreHoriz size={"28px"} />
        </div>
      </div>
      <hr className="line"></hr>
      <span className="project-language" style={{ backgroundColor: color }}>
        {projectDetails.language}
      </span>
      <div className="project-description">{projectDetails.description}</div>
      <div className="project-created-time">{projectDetails.createdTime}</div>
      <button className="project-action">
        <span>이동하기</span>
      </button>
    </div>
  );
};
export default ProjectCard;
