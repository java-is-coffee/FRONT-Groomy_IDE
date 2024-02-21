import React, { useEffect, useState } from "react";
import ProjectCard from "./projectCard";
import { ProjectDetails } from "../../api/project/patchProjectList";
import { getInvitedProjects } from "../../api/project/getInvitedProjectList";

import projectListStyles from "./projectListContainer.module.css";

const InvitedProjectListContainer: React.FC = () => {
  const [invitedProjects, setInvitedProjects] = useState<
    ProjectDetails[] | null
  >();
  useEffect(() => {
    const fetchInvitedProjects = async () => {
      try {
        const storedInvitedProjects: ProjectDetails[] | null =
          await getInvitedProjects();
        if (storedInvitedProjects) {
          setInvitedProjects(storedInvitedProjects);
        }
      } catch (error) {
        console.log("api 에러");
      }
    };

    if (!invitedProjects) {
      fetchInvitedProjects();
    }
    console.log();
  }, [invitedProjects]);
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
