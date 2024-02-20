import React, { useState } from "react";
import Sidebar from "../components/home/sidebar";
import "../styles/home/home.css";
import Nav from "../components/home/navigator";
import MainContent from "../components/home/mainContent";
import NewProjectModal from "../components/project/newProjectModal";

export enum ContentType {
  ProjectList = "project-list",
  InvitedProjectList = "invited-project",
  BoardList = "board-list",
  BoardContent = "board-content",
  BoardWrite = "board-write",
  Chat = "chat",
}

const Home: React.FC = () => {
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
