import React, { useEffect } from "react";
import ProjectCard from "./projectCard";
import { ProjectDetails } from "../../api/project/patchProjectList";
import { getInvitedProjects } from "../../api/project/getInvitedProjectList";

import projectListStyles from "./projectListContainer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { patchInvitedProjects } from "../../redux/reducers/projectReducer";
import { RootState } from "../../redux/store/store";

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
        }
      } catch (error) {
        console.log("api 에러");
      }
    };

    if (!invitedProjects) {
      fetchInvitedProjects();
    }
    console.log();
  }, [invitedProjects, dispatch]);
  return (
    <div className={projectListStyles[`project-list`]}>
      {invitedProjects &&
        invitedProjects.map((project) => (
          <ProjectCard
            key={project.projectId}
            projectDetails={project}
            type="invited"
          />
        ))}
    </div>
  );
};
export default InvitedProjectListContainer;
