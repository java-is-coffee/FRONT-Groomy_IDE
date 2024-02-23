import React, { useCallback, useEffect, useState } from "react";
import { ProjectDetails } from "../../api/project/patchProjectList";
import ProjectCardDropdown from "./dropdown/projectCardDropdown";
import { useNavigate } from "react-router-dom";
import { postParticipateProject } from "../../api/project/postPerticipateProject";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

import projectCardStyles from "./projectCard.module.css";
import { Button } from "@mui/material";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { rejectProjectInvite } from "../../api/project/rejectProjectInvite";
import { IProjectActionDTO } from "../../api/project/iprojectActionDto";
import { removeInvitedProjects } from "../../redux/reducers/projectReducer";
import { getProjectMemberList } from "../../api/member/getProjectMemberList";
import { IMember } from "../../api/member/imemberDTO";

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

const getRandomColor = (): string => {
  let color = "#";
  for (let i = 0; i < 3; i++) {
    // Generate a value in the range of 100 ~ 200 for more subdued colors
    const value = Math.floor(Math.random() * 100) + 100;
    // Convert the value to hexadecimal and add it to the color string
    color += value.toString(16).padStart(2, "0");
  }
  return color;
};

const ProjectCard: React.FC<projectProps> = ({ projectDetails, type }) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const color =
    LangColor[projectDetails.language as keyof typeof LangColor] || "white";
  const member = useSelector((state: RootState) => state.member.member);
  const [projectMember, setProjectMember] = useState<IMember[]>([]);

  const fetchAcceptProject = async () => {
    try {
      if (member) {
        const request: IProjectActionDTO = {
          projectId: projectDetails.projectId,
          hostMemberId: projectDetails.memberId,
          invitedMemberId: member?.memberId,
        };
        const result = await postParticipateProject(request);
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRejectProject = async () => {
    try {
      if (member) {
        const request: IProjectActionDTO = {
          projectId: projectDetails.projectId,
          hostMemberId: projectDetails.memberId,
          invitedMemberId: member?.memberId,
        };
        const result = await rejectProjectInvite(request);
        if (result) {
          dispatch(removeInvitedProjects(projectDetails.projectId));
        } else {
          console.log("접근 불가능한 행동입니다.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptInvite = () => {
    fetchAcceptProject();
  };
  const handleRejectInvite = () => {
    fetchRejectProject();
  };

  const fetchProjectMemberList = useCallback(async () => {
    try {
      const storedMembers: IMember[] | null = await getProjectMemberList(
        projectDetails.projectId
      );
      if (storedMembers) {
        setProjectMember(storedMembers);
      }
    } catch (error) {
      console.log(error);
    }
  }, [projectDetails.projectId]);

  useEffect(() => {
    if (type === "project") {
      fetchProjectMemberList();
    }
  }, [fetchProjectMemberList]);

  return (
    <div
      className={projectCardStyles[`project-card`]}
      id={projectDetails.projectId.toString()}
    >
      <div className={projectCardStyles[`project-header`]}>
        <div>
          <span className={projectCardStyles[`project-title`]}>
            {projectDetails.projectName}
          </span>
          <div
            className={projectCardStyles[`project-language`]}
            style={{ backgroundColor: color }}
          >
            <span>{projectDetails.language}</span>
          </div>
        </div>
        {type === "project" ? (
          <ProjectCardDropdown projectDetails={projectDetails} />
        ) : (
          ""
        )}
      </div>
      <div className={projectCardStyles[`project-member-container`]}>
        {type === "project"
          ? projectMember.map((member) => {
              return (
                <span
                  key={member.memberId}
                  className={projectCardStyles[`project-member`]}
                  style={{ background: getRandomColor() }}
                >
                  {member.nickname}
                </span>
              );
            })
          : ""}
      </div>

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
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            style={{ width: "150px" }}
            onClick={handleAcceptInvite}
            variant="outlined"
            color="success"
            startIcon={<FaCheck />}
          >
            참여하기
          </Button>
          <Button
            onClick={handleRejectInvite}
            style={{ width: "150px" }}
            variant="outlined"
            color="error"
            startIcon={<RxCross2 />}
          >
            거절하기
          </Button>
        </div>
      )}
    </div>
  );
};
export default ProjectCard;
