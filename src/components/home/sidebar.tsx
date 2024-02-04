import React, { useState } from "react";
import { VscProject } from "react-icons/vsc";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import "../../styles/home/sidebar.css";
import { Navigate, useNavigate } from "react-router-dom";

type SidebarProps = {
  onChange: (newState: boolean) => void;
  sideClose: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ onChange, sideClose }) => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="close-button" onClick={() => onChange(!sideClose)}>
        <MdOutlineKeyboardDoubleArrowLeft size={"32px"} />
      </div>
      <div className="side-list">
        <div
          className="user-container"
          onClick={() => {
            navigate("/user");
          }}
        >
          <div className="user-panel">
            <span className="name">username</span>
            <span className="email">ygj1828@gmail.com</span>
          </div>
        </div>
        <div className="nav-menu">
          <div className="menu">
            <div className="menu-container">
              <div className="icon">
                <VscProject size={"32px"} />
              </div>
              <span>프로젝트</span>
            </div>
          </div>
          <div
            className="menu"
            onClick={() => {
              navigate("/board");
            }}
          >
            <div className="menu-container">
              <div className="icon">
                <FaWpforms size={"32px"} />
              </div>
              <span>질문게시판</span>
            </div>
          </div>
        </div>
      </div>
      <div className="menu-container"></div>
    </div>
  );
};
export default Sidebar;
