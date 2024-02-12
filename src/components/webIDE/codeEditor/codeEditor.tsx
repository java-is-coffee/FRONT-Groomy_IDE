import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef } from "react";
import CodeTab from "./codeTab";

import "../../../styles/webIDE/codeContainer.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import * as monaco from "monaco-editor";
import {
  FileItem,
  saveItem,
} from "../../../redux/reducers/ide/fileSystemReducer";
import {
  CodeDetails,
  saveCode,
} from "../../../redux/reducers/ide/editingCodeReducer";

// theme enum
enum EditorTheme {
  iplastic = "iplastic",
  slush = "slushAndProppies",
  tomorrow = "tomorrow",
  xcode = "xcode",
}

const CodeEditor = () => {
  const theme = EditorTheme.iplastic;
  // 테마 변경 기능시 사용할 state
  //const [theme, setTheme] = useState<EditorTheme>(EditorTheme.xcode);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // redux에서 현재 edit중인 코드 정보 가져오기
  const curFile = useSelector(
    (state: RootState) => state.editingCode.editingCode
  );
  const editFiles = useSelector(
    (state: RootState) => state.editingCode.codeTabs
  );
  const monacoInstance = useMonaco();
  const dispatch = useDispatch();

  // 저장 메서드
  const saveDocument = useCallback(() => {
    const value = editorRef.current!.getValue();
    const item: FileItem = {
      id: curFile.id,
      name: curFile.name,
      type: "file",
      content: value,
    };
    dispatch(saveItem(item));

    const code: CodeDetails = {
      id: curFile.id,
      name: curFile.name,
      lang: curFile.name.split(".")[1],
      content: value,
    };
    dispatch(saveCode(code));

    // 코드 저장 api 추가 예정
  }, [curFile, dispatch]);

  // cmd + c || ctrl + c 입력시 저장 메서드 호출
  useEffect(() => {
    if (editorRef.current && curFile) {
      const disposable = editorRef.current.onKeyDown((e) => {
        if ((e.metaKey || e.ctrlKey) && e.keyCode === monaco.KeyCode.KeyS) {
          e.preventDefault();
          saveDocument();
        }
      });

      return () => disposable.dispose();
    }
  }, [curFile, dispatch, saveDocument]);

  // monaco editor 저장시 ref 세팅
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: any
  ) => {
    editorRef.current = editor;
  };

  // const handleTheme = () => {
  //   setTheme(EditorTheme.xcode);
  // };

  // monaco code editor theme setting
  useEffect(() => {
    if (monacoInstance) {
      // 테마 정의
      fetch(`./theme/ide/${theme}.json`)
        .then((data) => data.json())
        .then((themeData) => {
          monacoInstance.editor.defineTheme(`${theme}`, themeData);
          monacoInstance.editor.setTheme(`${theme}`);
        });
    }
  }, [monacoInstance, theme]);
  console.log(editFiles.length);
  return (
    <div className="code-container">
      <CodeTab />
      {editFiles.length !== 0 ? (
        <Editor
          language={curFile.lang}
          value={curFile.content}
          onMount={handleEditorDidMount}
        />
      ) : (
        <div className="code-edit-starter">
          <img src="/icon/Logo.png" alt="logo..." />
          <span>select file to edit</span>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
