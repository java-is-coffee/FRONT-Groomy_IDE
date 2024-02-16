import React, { useEffect, useRef, useState } from "react";
import CodeEditor from "../components/webIDE/codeEditor/codeEditor";
import StatusBar from "../components/webIDE/statusBar";
import CompositeBar from "../components/webIDE/compositeBar";

import "../styles/webIDE/webIDE.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import SideContainer from "../components/webIDE/sideContainer/sideContainer";
import { toggleSideContainer } from "../redux/reducers/ide/ideSideContainerReducer";

import {
  WebsocketProvider,
  useWebSocketContext,
} from "../context/webSocketContext";
import { useLocation } from "react-router-dom";

const WebIDE = () => {
  const isResizing = useRef(false);
  const [resizing, setResizing] = useState(false);
  const [sideContainerWidth, setSideContainerWidth] = useState(280); // 너비 상태 관리
  const resizeHandle = useRef<HTMLDivElement>(null); // 리사이징 핸들에 대한 참조
  const dispatch = useDispatch();
  const { connect, disconnect } = useWebSocketContext();
  const location = useLocation();
  const isOpenSide = useSelector(
    (state: RootState) => state.ideSideContainer.open
  );

  // 사이드 컨테이너 마우스 드레그 & 드롭으로 조절 기능
  useEffect(() => {
    const currentResizeHandle = resizeHandle.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current) {
        const newWidth = e.clientX - 48;
        if (newWidth > 150) {
          setSideContainerWidth(newWidth);
        } else {
          dispatch(toggleSideContainer());
          isResizing.current = false;
          setResizing(false); // 여기서 리사이징 상태 업데이트
        }
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      setResizing(false); // 여기서 리사이징 상태 업데이트
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    const startResizing = (e: MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      setResizing(true); // 여기서 리사이징 상태 업데이트
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    if (currentResizeHandle) {
      currentResizeHandle.addEventListener("mousedown", startResizing);
    }

    return () => {
      if (currentResizeHandle) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [dispatch]); // isResizing을 의존성 배열에서 제거

  useEffect(() => {
    // 페이지에 진입할 때 웹소켓 연결
    connect("ws/project");

    // 컴포넌트가 언마운트될 때 웹소켓 연결 해제
    return () => {
      disconnect();
    };
  }, [connect, disconnect, location.pathname]);
  return (
    <WebsocketProvider>
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
        {isOpenSide ? (
          <div
            ref={resizeHandle} // 리사이징 핸들 참조 연결
            className={`resize-handle${resizing ? " active" : ""}`}
          />
        ) : (
          <div
            ref={resizeHandle} // 리사이징 핸들 참조 연결
            className={`resize-handle closed${resizing ? " active" : ""}`}
          />
        )}
        <div
          className="code-editor"
          style={
            isOpenSide
              ? { width: `calc(100% - ${sideContainerWidth}px - 52px)` }
              : { width: `calc(100% -  52px)` }
          }
        >
          <CodeEditor />
        </div>
        <div className="status-bar">
          <StatusBar />
        </div>
      </div>
    </WebsocketProvider>
  );
};

export default WebIDE;
