import React, { useEffect, useState } from "react";
import "../../styles/project/projectListContainer.css";
import ProjectCard from "./projectCard";

import {
  ProjectDetails,
  patchProjectList,
} from "../../api/project/patchProjectList";

const ProjectListContainer = () => {
  const [projects, setProjects] = useState<ProjectDetails[] | null>();
  useEffect(() => {
    const fetchProjectListData = async () => {
      try {
        const storedProjects: ProjectDetails[] | null =
          await patchProjectList();
        setProjects(storedProjects);
      } catch (error) {
        console.log("api 에러");
      }
    };
    if (!projects) {
      fetchProjectListData();
    }
  }, [projects]);
  return (
    <div className="project-list">
      {projects &&
        projects.map((project) => (
          <ProjectCard
            key={project.projectId}
            projectDetails={project}
            type="project"
          />
        ))}
    </div>
  );
};
export default ProjectListContainer;
