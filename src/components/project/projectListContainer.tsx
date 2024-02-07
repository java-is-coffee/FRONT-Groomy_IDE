import React, { useEffect, useState } from "react";
import "../../styles/project/projectListContainer.css";
import ProjectCard from "./projectCard";

import {
  ProjectDetails,
  patchProjectList,
} from "../../api/project/patchProjectList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { patchProjects } from "../../redux/reducers/projectReducer";

interface ProjectListContainer {
  projectList: ProjectDetails[];
  onPatch: () => ProjectDetails[];
}

const ProjectListContainer: React.FC = () => {
  const accessToken = localStorage.getItem("accessToken");
  const projects = useSelector((state: RootState) => state.projects.projects);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProjectListData = async () => {
      try {
        const storedProjects: ProjectDetails[] | null =
          await patchProjectList();
        if (storedProjects) {
          dispatch(patchProjects(storedProjects));
        }
      } catch (error) {
        console.log("api 에러");
      }
    };
    if (!projects) {
      fetchProjectListData();
    }
  }, [accessToken, projects]);
  return (
    <div className="project-list">
      {projects &&
        projects.map((project) => (
          <ProjectCard key={project.projectId} projectDetails={project} />
        ))}
    </div>
  );
};
export default ProjectListContainer;
