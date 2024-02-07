import React from "react";

import "../../styles/project/projectCard.css";
import { ProjectDetails } from "../../api/project/patchProjectList";
import ProjectCardDropdown from "./dropdown/projectCardDropdown";

type projectProps = {
  projectDetails: ProjectDetails;
};

enum LangColor {
  JAVASCRIPT = "#F7DF1E",
  C = "#A8B9CC",
  CPP = "#00599C",
  PYTHON = "#3776AB",
  KOTLIN = "#7F52FF",
  JAVA = "#F8981C",
}

const ProjectCard: React.FC<projectProps> = ({ projectDetails }) => {
  const color =
    LangColor[projectDetails.language as keyof typeof LangColor] || "white";
  return (
    <div className="project-card" id={projectDetails.projectId.toString()}>
      <div className="project-header">
        <span className="project-title">{projectDetails.projectName}</span>
        <ProjectCardDropdown projectId={projectDetails.projectId} />
      </div>
      <span className="project-language" style={{ backgroundColor: color }}>
        {projectDetails.language}
      </span>
      <div className="project-description">{projectDetails.description}</div>
      <div className="project-created-time">{projectDetails.createdDate}</div>
      <button className="project-action">
        <span>이동하기</span>
      </button>
    </div>
  );
};
export default ProjectCard;
