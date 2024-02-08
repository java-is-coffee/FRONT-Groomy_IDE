import React from "react";
import CodeEditor from "../components/webIDE/codeEditor";
import StatusBar from "../components/webIDE/statusBar";
import SideMenu from "../components/webIDE/sideMenu";

import "../styles/webIDE/webIDE.css";

const WebIDE = () => {
  return (
    <div className="ide">
      <div className="side-menu">
        <SideMenu />
      </div>
      <div className="code-editor">
        <CodeEditor />
      </div>
      <div className="status-bar">
        <StatusBar />
      </div>
    </div>
  );
};

export default WebIDE;
