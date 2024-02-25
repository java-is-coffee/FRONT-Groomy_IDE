import React, { useEffect } from "react";
import CodeTab from "./codeTab";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import useWebSocket from "../../../hooks/useWebSocket";
import { useParams } from "react-router-dom";

import editorStyles from "./codeEditor.module.css";
import MonacoEditorV2 from "./monacoEditor-v2";

// enum EditorTheme {
//   iplastic = "iplastic",
//   slush = "slushAndProppies",
//   tomorrow = "tomorrow",
//   xcode = "xcode",
// }

const CodeEditor = () => {
  // 테마 변경 기능시 사용할 state
  //const [theme, setTheme] = useState<EditorTheme>(EditorTheme.xcode);
  // redux에서 현재 edit중인 코드 정보 가져오기
  const { projectId } = useParams();
  const editFiles = useSelector(
    (state: RootState) => state.editingCode.codeTabs
  );
  const { unsubscribe } = useWebSocket();

  // monaco code editor theme setting
  // useEffect(() => {
  //   if (monacoInstance) {
  //     // 테마 정의
  //     fetch(`./theme/ide/${theme}.json`)
  //       .then((data) => data.json())
  //       .then((themeData) => {
  //         monacoInstance.editor.defineTheme(`${theme}`, themeData);
  //         monacoInstance.editor.setTheme(`${theme}`);
  //       });
  //   }
  // }, [theme]);

  // 프로젝트 페이지 언마운트시 구독 취소
  useEffect(() => {
    return () => unsubscribe(`/projectws/${projectId}/code`);
  });

  return (
    <div className={editorStyles[`code-container`]}>
      <CodeTab />
      {editFiles.length !== 0 ? (
        // <MonacoEditor />
        <MonacoEditorV2 />
      ) : (
        <div className={editorStyles[`code-edit-starter`]}>
          <img src="/icon/Logo.png" alt="logo..." />
          <span>select file to edit</span>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
