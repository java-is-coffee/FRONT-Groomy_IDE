import React from "react";
import { ProjectDetails } from "../../api/project/patchProjectList";
import ProjectCardDropdown from "./dropdown/projectCardDropdown";
import { useNavigate } from "react-router-dom";
import {
  AcceptInvite,
  postParticipateProject,
} from "../../api/project/postPerticipateProject";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

import projectCardStyles from "./projectCard.module.css";

type projectProps = {
  projectDetails: ProjectDetails;
  type: string;
};

enum LangColor {
  JAVASCRIPT = "#F7DF1E",
  C = "#A8B9CC",
  CPP = "#00599C",
  PYTHON = "#3776AB",
  KOTLIN = "#7F52FF",
  JAVA = "#F8981C",
}

const ProjectCard: React.FC<projectProps> = ({ projectDetails, type }) => {
  const nav = useNavigate();
  const color =
    LangColor[projectDetails.language as keyof typeof LangColor] || "white";
  const member = useSelector((state: RootState) => state.member.member);
  const fetchAcceptProject = async () => {
    try {
      if (member) {
        const request: AcceptInvite = {
          projectId: projectDetails.projectId,
          hostMemberId: projectDetails.memberId,
          invitedMemberId: member?.memberId,
        };
        const result = postParticipateProject(request);
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptInvite = () => {
    fetchAcceptProject();
  };
  return (
    <div
      className={projectCardStyles[`project-card`]}
      id={projectDetails.projectId.toString()}
    >
      <div className={projectCardStyles[`project-header`]}>
        <span className={projectCardStyles[`project-title`]}>
          {projectDetails.projectName}
        </span>
        <ProjectCardDropdown projectId={projectDetails.projectId} />
      </div>
      <span
        className={projectCardStyles[`project-language`]}
        style={{ backgroundColor: color }}
      >
        {projectDetails.language}
      </span>
      <div className={projectCardStyles[`project-description`]}>
        {projectDetails.description}
      </div>
      <div className={projectCardStyles[`project-created-time`]}>
        {projectDetails.createdDate}
      </div>
      {type === "project" ? (
        <button
          className={projectCardStyles[`project-action`]}
          onClick={() => nav(`/code-editor/${projectDetails.projectId}`)}
        >
          <span>이동하기</span>
        </button>
      ) : (
        <button
          className={projectCardStyles[`project-action`]}
          onClick={handleAcceptInvite}
        >
          <span>참여하기</span>
        </button>
      )}
    </div>
  );
};
export default ProjectCard;
