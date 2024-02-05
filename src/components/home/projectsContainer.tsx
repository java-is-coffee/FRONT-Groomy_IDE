import React, { useEffect, useState } from "react";
import ProjectCard from "./projectCard";

import "../../styles/home/projectsContainer.css";
import { ProjectDetails, getProjectList } from "../api/project/getProjectlist";

type projectListProps = {
  onChange: (newState: boolean) => void;
  sideClose: boolean;
};

const ProjectsContainer: React.FC<projectListProps> = ({
  onChange,
  sideClose,
}) => {
  const accessToken = localStorage.getItem("accessToken");
  const [projectList, setProjectList] = useState<ProjectDetails[] | null>(null);
  useEffect(() => {
    const fetchProjectListData = async () => {
      try {
        const projects = await getProjectList();
        setProjectList(projects);
        console.log(projects);
      } catch (error) {
        console.log("서버 에러");
      }
    };
    if (accessToken) {
      fetchProjectListData();
    }
  }, [accessToken]);
  return (
    <div className="contents">
      <div className="projects">
        {projectList &&
          projectList.map((project) => (
            <ProjectCard key={project.projectId} projectDetails={project} />
          ))}
      </div>
    </div>
  );
};
export default ProjectsContainer;
