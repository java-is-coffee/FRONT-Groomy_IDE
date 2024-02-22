import React, { useEffect, useState } from "react";
import Sidebar from "../components/home/sidebar";
import Nav from "../components/home/navigator";
import MainContent from "../components/home/mainContent";
import { useNavigate } from "react-router-dom";

import homeStyle from "./home.module.css";
import NewProjectModal from "../components/project/modal/newProjectModal";
import EditProjectModal from "../components/project/modal/editProjectModal";
import InviteProjectDetailsModal from "../components/project/modal/inviteModal";

export enum ContentType {
  ProjectList = "project-list",
  InvitedProjectList = "invited-project",
  BoardList = "board-list",
  BoardContent = "board-content",
  BoardWrite = "board-write",
  Chat = "chat",
}

const HomePage: React.FC = () => {
  const move = useNavigate();
  // sidebar 닫힘 여부
  const [sideClose, setSideClosed] = useState<boolean>(false);
  // sidebar handler
  const handleSidebarToggle = (changeState: boolean) => {
    setSideClosed(changeState);
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
      <nav className={homeStyle.nav}>
        <Nav onChange={handleSidebarToggle} sideClose={sideClose} />
      </nav>
      <NewProjectModal />
      <EditProjectModal />
      <InviteProjectDetailsModal />
      <div className={homeStyle.container}>
        <aside
          className={`${homeStyle.sidebar} ${
            sideClose ? homeStyle.closed : ""
          }`}
        >
          <Sidebar onChange={handleSidebarToggle} sideClose={sideClose} />
          <Sidebar onChange={handleSidebarToggle} sideClose={sideClose} />
        </aside>
        <div
          className={`${homeStyle["main-content"]} ${
            sideClose ? homeStyle.wide : ""
          }`}
        >
          <MainContent />
          <MainContent />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
