import { Editor, OnMount, useMonaco } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef } from "react";
import CodeTab from "./codeTab";

import "../../../styles/webIDE/codeContainer.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import * as monaco from "monaco-editor";
import {
  CodeDetails,
  saveCode,
} from "../../../redux/reducers/ide/editingCodeReducer";
import { useParams } from "react-router-dom";
import useWebSocket from "../../../hooks/useWebSocket";
import useContentWidget from "../../../hooks/useCotentWidget";
// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";
// import { MonacoBinding } from "y-monaco";
// import { getTempToken } from "../../../api/auth/getTempToken";

// theme enum
enum EditorTheme {
  iplastic = "iplastic",
  slush = "slushAndProppies",
  tomorrow = "tomorrow",
  xcode = "xcode",
}

interface CodeDTO {
  action: string;
  memberId: number;
  fileId: string;
  codeEdit: CodeEdit;
}

interface CodeEdit {
  memberName: string;
  range: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  text: string;
}

const CodeEditor = () => {
  const { projectId } = useParams();
  const { stompClient, connect, subscribe, sendMessage } = useWebSocket();
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
  const member = useSelector((state: RootState) => state.member.member);

  //const [tempToken, setTempToken] = useState<string>("");
  // 저장 메서드
  // const saveDocument = useCallback(() => {
  //   const value = editorRef.current!.getValue();
  //   const item: FileItem = {
  //     id: curFile.id,
  //     name: curFile.name,
  //     type: "FILE",
  //     path: "/",
  //   };
  //   dispatch(saveItem(item));

  //   const code: CodeDetails = {
  //     id: curFile.id,
  //     name: curFile.name,
  //     lang: curFile.name.split(".")[1],
  //     content: value,
  //   };
  //   dispatch(saveCode(code));

  //   코드 저장 api 추가 예정
  // }, [curFile, dispatch]);

  // cmd + s || ctrl + s 입력시 저장 메서드 호출
  useEffect(() => {
    if (editorRef.current && curFile) {
      const disposable = editorRef.current.onKeyDown((e) => {
        if ((e.metaKey || e.ctrlKey) && e.keyCode === monaco.KeyCode.KeyS) {
          e.preventDefault();
          // saveDocument();
        }
      });

      return () => disposable.dispose();
    }
  }, [curFile, dispatch]);

  // 커서 위치 보내기
  const handleEditorDidMount: OnMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: any
  ) => {
    editorRef.current = editor;
    // const model = editor.getModel();
    // if (projectId && model !== null) {
    //   // yjs doc 설정
    //   const ydoc = new Y.Doc();
    //   console.log(tempToken);
    //  const provider = new WebsocketProvider(
    //     `ws://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/YJS/`,
    //     projectId,
    //     ydoc,
    //     { params: { ["tempToken"]: tempToken } }
    //   );
    //   const ytext = ydoc.getText("monaco");

    //   // Ensure model is passed correctly to MonacoBinding
    //   new MonacoBinding(ytext, model, new Set([editor]), provider.awareness);
    // }

    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      const storedCode = sessionStorage.getItem("curCode");
      if (member?.memberId && storedCode) {
        const curCode: CodeDetails = JSON.parse(storedCode);
        const message: CodeDTO = {
          action: "CURSOR",
          fileId: curCode.id,
          memberId: member?.memberId,
          codeEdit: {
            memberName: member?.nickname,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            text: "",
          },
        };
        sendMessage(`/app/project-code/${projectId}/send`, message);
      }
    });
  };

  // const handleTheme = () => {
  //   setTheme(EditorTheme.xcode);
  // };

  const handleEditorChange = useCallback(
    (
      value: string | undefined,
      event: monaco.editor.IModelContentChangedEvent
    ) => {
      if (value) {
        const updatedCodeDetails: CodeDetails = {
          ...curFile,
          content: value,
        };
        dispatch(saveCode(updatedCodeDetails));
      }
    },
    [curFile, dispatch]
  );

  const { manageWidget } = useContentWidget();

  useEffect(() => {
    if (!stompClient) {
      console.log("code editor connection");
      connect("ws/project");
    }

    subscribe(`/projectws/${projectId}/code`, (message) => {
      // 메시지에 대한 처리 로직
      const storedFile = sessionStorage.getItem("curCode");
      if (storedFile) {
        const code: CodeDetails = JSON.parse(storedFile);
        const data: CodeDTO = JSON.parse(message.body);
        if (data.memberId !== member?.memberId && data.action === "CURSOR") {
          console.log(code);
          console.log(data.fileId);
          if (editorRef.current && data.fileId === code.id) {
            manageWidget(editorRef.current, {
              memberId: data.memberId,
              codeEdit: data.codeEdit,
            });
          }
        }
      }
    });
  }, [stompClient, subscribe, connect, manageWidget, member, projectId]);

  // monaco code editor theme setting
  useEffect(() => {
    // 임시토큰 발급
    // const fetchTempToken = async () => {
    //   const token = await getTempToken();
    //   if (token !== null) {
    //     setTempToken(token);
    //   } else {
    //     console.log("권한 오류입니다.");
    //   }
    // };

    // fetchTempToken();

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

  return (
    <div className="code-container">
      <CodeTab />
      {editFiles.length !== 0 ? (
        <Editor
          language={curFile.lang}
          value={curFile.content}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
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
