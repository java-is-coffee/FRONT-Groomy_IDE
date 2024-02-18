import React, { useEffect } from "react";
import "../../styles/project/projectListContainer.css";
import ProjectCard from "./projectCard";

import {
  ProjectDetails,
  patchProjectList,
} from "../../api/project/patchProjectList";
import { useDispatch, useSelector } from "react-redux";
import { patchProjects } from "../../redux/reducers/projectReducer";
import { RootState } from "../../redux/store/store";

const ProjectListContainer = () => {
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
  }, [projects, dispatch]);
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
