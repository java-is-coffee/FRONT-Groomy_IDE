import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./projectCard";

import "../../styles/home/projectList.css";

const PROJECT_API_URL =
  "http://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/api/ide/list";

interface ProjectList {
  list: ProjectDetails[];
}

interface ProjectDetails {
  projectId: number;
  memberId: number;
  projectName: string;
  description: string;
  language: string;
  createdDate: string;
  deleted: boolean;
  projectPath: string;
}
type projectListProps = {
  onChange: (newState: boolean) => void;
  sideClose: boolean;
};

const ProjectList: React.FC<projectListProps> = ({ onChange, sideClose }) => {
  const [projectList, setProjectList] = useState<ProjectDetails[] | null>(null);
  const apiProjects = [
    {
      projectId: 1,
      memberId: 3,
      projectName: "프로젝트 A",
      language: "Java",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 13412,
      memberId: 3,
      projectName: "프로젝트 B",
      language: "JavaScript",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 3,
      memberId: 3,
      projectName: "Groomy ide",
      language: "Kotlin",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 4,
      memberId: 3,
      projectName: "test",
      language: "Python",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 5,
      memberId: 3,
      projectName: "test",
      language: "C",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 11,
      memberId: 3,
      projectName: "teste",
      language: "Cpp",
      description: "sett",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 132,
      memberId: 3,
      projectName: "프로젝트 A",
      language: "Java",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 244,
      memberId: 3,
      projectName: "프로젝트 A",
      language: "Java",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 1312321,
      memberId: 3,
      projectName: "프로젝트 A",
      language: "Java",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 3141,
      memberId: 3,
      projectName: "프로젝트 A",
      language: "Java",
      description:
        "Feat : OW-14 CI workflow 작성 PR 요청 시 빌드를 진행하도록 작성 - PR하는 브랜치가 main, develop 일 때, /back 폴더의 프로젝트를 빌드",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
    {
      projectId: 14234,
      memberId: 3,
      projectName: "프로젝트 A",
      language: "Java",
      description: "this is java",
      createdTime: "2024-01-15",
      deleted: false,
      projectPath: "/main",
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const response = await axios.get<ProjectDetails[]>(PROJECT_API_URL, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setProjectList(response.data);
        } else {
          console.error("accessToken 오류...");
        }
      } catch (error) {
        console.error("서버 오류입니다.", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="contents">
      <div className="projects">
        {/* {projectList &&
          projectList.map((project) => (
            <ProjectCard key={project.projectId} projectDetails={project} />
          ))} */}
        {apiProjects &&
          apiProjects.map((project) => (
            <ProjectCard key={project.projectId} projectDetails={project} />
          ))}
      </div>
    </div>
  );
};
export default ProjectList;
