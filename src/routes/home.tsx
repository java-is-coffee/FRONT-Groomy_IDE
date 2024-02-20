import React, { useEffect, useState } from "react";
import Sidebar from "../components/home/sidebar";
import "../styles/home/home.css";
import Nav from "../components/home/navigator";
import MainContent from "../components/home/mainContent";
import NewProjectModal from "../components/project/newProjectModal";
import { useNavigate } from "react-router-dom";

export enum ContentType {
  ProjectList = "project-list",
  BoardList = "board-list",
  BoardContent = "board-content",
  BoardWrite = "board-write",
  Chat = "chat",
}

const Home: React.FC = () => {
  const move = useNavigate();
  // sidebar 닫힘 여부
  const [sideClose, setSideClosed] = useState<boolean>(false);
  // sidebar handler
  const handleSidebarToggle = (changeState: boolean) => {
    setSideClosed(changeState);
  };
  // 메인 컨텐츠 타입 state
  const [curContent, setCurContent] = useState<ContentType>(
    ContentType.ProjectList
  );
  // 메인 컨텐츠 handler
  const handleContentChange = (content: ContentType) => {
    setCurContent((prevContent) => {
      if (prevContent !== content) {
        setCurContent(content);
        return content;
      }
      return prevContent;
    });
  };
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsProjectModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProjectModalOpen(false);
  };

  //GoogleOauth 로그인 시, 필요한 작업
  useEffect(() => {
    console.log("토큰 확인");
    function getQueryParam(param: string) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }
    const accessToken = getQueryParam("access_token");
    const refreshToken = getQueryParam("refresh_token");

    if (!localStorage.getItem("accessToken")) {
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
    move("/");
  }, [move]);

  return (
    <div>
      <nav className="nav">
        <Nav
          onChange={handleSidebarToggle}
          sideClose={sideClose}
          onOpen={handleOpenModal}
        />
      </nav>
      <NewProjectModal isOpen={isProjectModalOpen} onClose={handleCloseModal} />
      <div className="container">
        <aside className={`sidebar ${sideClose ? "closed" : ""}`}>
          <Sidebar
            onSelectContents={handleContentChange}
            onChange={handleSidebarToggle}
            sideClose={sideClose}
          />
        </aside>
        <div className={`main-content ${sideClose ? "wide" : ""}`}>
          <MainContent
            curContent={curContent}
            onSelectContents={handleContentChange}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
