import React, { useEffect } from "react";
import ProjectCard from "./projectCard";
import { ProjectDetails } from "../../api/project/patchProjectList";
import { getInvitedProjects } from "../../api/project/getInvitedProjectList";

import projectListStyles from "./projectListContainer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { patchInvitedProjects } from "../../redux/reducers/projectReducer";
import { RootState } from "../../redux/store/store";
import { toast } from "react-toastify";

const InvitedProjectListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const invitedProjects = useSelector(
    (state: RootState) => state.projects.invitedProjects
  );
  useEffect(() => {
    const fetchInvitedProjects = async () => {
      try {
        const storedInvitedProjects: ProjectDetails[] | null =
          await getInvitedProjects();
        if (storedInvitedProjects) {
          dispatch(patchInvitedProjects(storedInvitedProjects));
        } else {
          toast.error("잘못된 접근입니다.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        toast.error("api error", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    if (!invitedProjects) {
      fetchInvitedProjects();
    }
    console.log();
  }, [invitedProjects, dispatch]);
  return (
    <div className={projectListStyles[`project-list`]}>
      {invitedProjects?.length === 0 ? (
        <div className={projectListStyles[`project-starter`]}>
          <img src="/icon/Logo.png" alt="logo..." />
          <span>초대가 없습니다...</span>
        </div>
      ) : (
        invitedProjects &&
        invitedProjects.map((project) => (
          <ProjectCard
            key={project.projectId}
            projectDetails={project}
            type="project"
          />
        ))
      )}
    </div>
  );
};
export default InvitedProjectListContainer;
