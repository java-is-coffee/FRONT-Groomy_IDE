import React, { useEffect, useRef, useState } from "react";
import CodeEditor from "../components/webIDE/codeEditor/codeEditor";
import StatusBar from "../components/webIDE/statusBar";
import CompositeBar from "../components/webIDE/compositeBar";

import styles from "../styles/webIDE/webIDE.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import SideContainer from "../components/webIDE/sideContainer/sideContainer";
import { toggleSideContainer } from "../redux/reducers/ide/ideSideContainerReducer";
import { FileItem, setItems } from "../redux/reducers/ide/fileSystemReducer";

const WebIDE = () => {
  const data: FileItem[] = [
    {
      id: "1",
      name: "Root",
      type: "folder",
      children: [
        {
          id: "2",
          name: "SubFolder",
          type: "folder",
          children: [
            {
              id: "3",
              name: "FileInSubFolder.txt",
              type: "file",
            },
            {
              id: "4",
              name: "test.ts",
              type: "file",
              content: "function ex",
            },
          ],
        },
        {
          id: "5",
          name: "FileInRoot.c",
          type: "file",
        },
        {
          id: "6",
          name: "FileInRoot.cpp",
          type: "file",
        },
      ],
    },
  ];
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
  }, [dispatch]); // isResizing을 의존성 배열에서 제거
  // test 폴더 구조 주입
  dispatch(setItems(data));
  return (
    <div className={styles.ide}>
      <div className={styles["composite-bar"]}>
        <CompositeBar />
      </div>
      <div
        className={`${styles["side-container"]} ${isOpenSide ? "" : styles.closed}`}
        style={
          isOpenSide ? { width: `${sideContainerWidth}px` } : { width: "0px" }
        }
      >
        <SideContainer />
      </div>
      {isOpenSide ? (
        <div
          ref={resizeHandle} // 리사이징 핸들 참조 연결
          className={`${styles["resize-handle"]} ${resizing ? styles.active : ""}`}
        />
      ) : (
        <div
          ref={resizeHandle} // 리사이징 핸들 참조 연결
          className={`${styles["resize-handle"]} ${styles.closed} ${resizing ? styles.active : ""}`}
        />
      )}
      <div
        className={styles["code-editor"]}
        style={
          isOpenSide
            ? { width: `calc(100% - ${sideContainerWidth}px - 52px)` }
            : { width: `calc(100% -  52px)` }
        }
      >
        <CodeEditor />
      </div>
      <div className={styles["status-bar"]}>
        <StatusBar />
      </div>
    </div>
  );
};

export default WebIDE;
