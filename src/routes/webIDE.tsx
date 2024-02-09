import React, { useEffect, useRef, useState } from "react";
import CodeEditor from "../components/webIDE/codeEditor/codeEditor";
import StatusBar from "../components/webIDE/statusBar";
import CompositeBar from "../components/webIDE/compositeBar";

import "../styles/webIDE/webIDE.css";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import SideContainer from "../components/webIDE/sideContainer/sideContainer";

const WebIDE = () => {
  const testFiles = ["test.java", "test.py", "codes.js"];
  const isResizing = useRef(false);
  const [sideContainerWidth, setSideContainerWidth] = useState(280); // 너비 상태 관리
  const resizeHandle = useRef<HTMLDivElement>(null); // 리사이징 핸들에 대한 참조

  const isOpenSide = useSelector(
    (state: RootState) => state.ideSideContainer.open
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current) {
        const newWidth = e.clientX;
        setSideContainerWidth(newWidth); // 너비 상태 업데이트
        console.log(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
    };

    const startResizing = (e: MouseEvent) => {
      isResizing.current = true;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    // 리사이징 핸들에 대한 참조를 사용하여 이벤트 리스너를 등록합니다.
    if (resizeHandle.current) {
      resizeHandle.current.addEventListener("mousedown", startResizing);
    }

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      if (resizeHandle.current) {
        resizeHandle.current.removeEventListener("mousedown", startResizing);
      }
    };
  }, []);
  return (
    <div className="ide">
      <div className="composite-bar">
        <CompositeBar />
      </div>
      <div
        className={`side-container ${isOpenSide ? "" : "closed"}`}
        style={
          isOpenSide ? { width: `${sideContainerWidth}px` } : { width: "0px" }
        }
      >
        <SideContainer />
      </div>
      <div
        ref={resizeHandle} // 리사이징 핸들 참조 연결
        className="resize-handle"
      />
      <div
        className="code-editor"
        style={
          isOpenSide
            ? { width: `calc(100% - ${sideContainerWidth}px - 53px)` }
            : { width: `calc(100% -  53px)` }
        }
      >
        <CodeEditor />
      </div>
      <div className="status-bar">
        <StatusBar />
      </div>
    </div>
  );
};

export default WebIDE;
