import React, { useEffect, useRef, useState } from "react";
import CodeEditor from "../components/webIDE/codeEditor/codeEditor";
import StatusBar from "../components/webIDE/statusBar";
import CompositeBar from "../components/webIDE/compositeBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import SideContainer from "../components/webIDE/sideContainer/sideContainer";
import { toggleSideContainer } from "../redux/reducers/ide/ideSideContainerReducer";
import { useParams } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import { getMemberInfo } from "../api/auth/getMemberInfo";
import { setMember } from "../redux/reducers/memberReducer";
import { patchAccessToken } from "../api/auth/patchAccessToken";
import { reSetCurEditingCode } from "../redux/reducers/ide/editingCodeReducer";
import { resetItems } from "../redux/reducers/ide/fileSystemReducer";
import { setIdeOption } from "../redux/reducers/ide/ideOptionReducer";
import IdeOptionType from "../enum/ideOptionType";

import "../styles/webIDE/webIDE.css";
const IdePage = () => {
  const isResizing = useRef(false);
  const [resizing, setResizing] = useState(false);
  const [sideContainerWidth, setSideContainerWidth] = useState(280); // 너비 상태 관리
  const resizeHandle = useRef<HTMLDivElement>(null); // 리사이징 핸들에 대한 참조
  const dispatch = useDispatch();
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
  }, [dispatch]);

  const { projectId } = useParams();
  const member = useSelector((state: RootState) => state.member.member);
  const { stompClient, connect, disconnect, unsubscribe } = useWebSocket();

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const member = await getMemberInfo();
        console.log(member);
        if (member) {
          dispatch(setMember(member));
        } else {
          console.log("맴버 정보 오류");
        }
      } catch (error) {
        console.error("맴버 정보 가져오기 실패:", error);
      }
    };
    // 멤버 정보 가져오기
    if (!member) {
      fetchMemberInfo();
    }

    const fetchToken = async () => {
      try {
        const isUpdateToken = await patchAccessToken();
        if (isUpdateToken) {
          console.log("토큰 재발급 완료");
        } else {
          console.log("토큰 정보 오류");
        }
      } catch (error) {
        console.error("맴버 정보 가져오기 실패:", error);
      }
    };

    fetchToken();

    // 웹소켓 연결이 안되어있는 경우 연결
    if (!stompClient) {
      connect("ws/project");
    } else {
      console.log(stompClient);
    }
    return () => {
      console.log("connection 끊기");
      if (projectId) {
        disconnect(projectId);
      }
      dispatch(reSetCurEditingCode());
      dispatch(resetItems());
      dispatch(setIdeOption(IdeOptionType.File));
    };
  }, [member, dispatch, connect, disconnect, stompClient]);

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
  );
};

export default IdePage;
