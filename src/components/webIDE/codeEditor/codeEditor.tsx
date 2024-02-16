import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useWebSocketContext } from "../../../context/webSocketContext";
import { getMemberInfo } from "../../../api/auth/getMemberInfo";
import { addMember } from "../../../redux/reducers/memberReducer";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

// theme enum
enum EditorTheme {
  iplastic = "iplastic",
  slush = "slushAndProppies",
  tomorrow = "tomorrow",
  xcode = "xcode",
}

interface codeEditDTO {
  action: string;
  fileId: string;
  memberId: number;
  codeEdit: {
    range: {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
    };
    text: string;
    rangeOffset: number;
    rangeLength: number;
  };
}

interface cursorDTO {}

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
    // const item: FileItem = {
    //   id: curFile.id,
    //   name: curFile.name,
    //   type: "FILE",
    //   path: "/",
    // };
    // dispatch(saveItem(item));

    // const code: CodeDetails = {
    //   id: curFile.id,
    //   name: curFile.name,
    //   lang: curFile.name.split(".")[1],
    //   content: value,
    // };
    // dispatch(saveCode(code));

    // 코드 저장 api 추가 예정
  }, [curFile, dispatch]);

  // cmd + s || ctrl + s 입력시 저장 메서드 호출
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

  const ydoc = new Y.Doc();
  const [provider, setProvider] = useState(null);
  const yText = ydoc.getText("monaco");
  const awarenessRef = useRef(null); // Awareness 인스턴스를 저장하기 위한 ref

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: any
  ) => {
    editorRef.current = editor;
    const model = editor.getModel();
    if (model) {
      new MonacoBinding(yText, model, new Set([editor]), provider.awareness);
    }
  };

  // const handleTheme = () => {
  //   setTheme(EditorTheme.xcode);
  // };

  const fetchMemberInfo = async () => {
    const member = await getMemberInfo();
    if (member) {
      dispatch(addMember(member));
    } else {
      console.log("맴버 정보 오류");
    }
  };

  // custom hock 에서 가져오기
  const { projectId } = useParams();
  const { stompClient, subscribe, sendMessage } = useWebSocketContext();
  const [isApplyingServerChanges, setIsApplyingServerChanges] = useState(false);

  const memberId = useSelector(
    (state: RootState) => state.member.member?.memberId
  );

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
        if (isApplyingServerChanges) {
          return;
        }
        if (!memberId) {
          fetchMemberInfo();
        }
        // 변경된 내용이 있는 경우 웹소켓을 통해 서버로 전송
        // if (stompClient && event.changes.length > 0) {
        //   const change = event.changes[0];
        //   const message = {
        //     action: "CODE" || "CURSOR",
        //     memberId: memberId,
        //     fileId: curFile.id,
        //     codeEdit: {
        //       range: {
        //         startLineNumber: change.range.startLineNumber,
        //         startColumn: change.range.startColumn,
        //         endLineNumber: change.range.endLineNumber,
        //         endColumn: change.range.endColumn,
        //       },
        //       text: change.text,
        //       rangeOffset: change.rangeOffset,
        //       rangeLength: change.rangeLength,
        //     },
        //   };
        //   sendMessage(`/app/project-code/${projectId}/send`, message);
        // }
      }
    },
    [curFile, dispatch, isApplyingServerChanges]
  );

  useEffect(() => {
    // if (stompClient) {
    //   subscribe(`/projectws/${projectId}/code`, (message) => {
    //     // 메시지에 대한 처리 로직
    //     const data: codeEditDTO = JSON.parse(message.body);
    //     if (data.memberId !== memberId) {
    //       setIsApplyingServerChanges(true);
    //       // 에디터 변경 사항을 적용하기 위한 로직
    //       if (editorRef.current && data.fileId === curFile.id) {
    //         // 에디터의 모델(문서)을 가져옵니다.
    //         const model = editorRef.current.getModel();
    //         if (model) {
    //           // 변경 사항을 적용하기 위한 범위 객체를 생성합니다.
    //           const range = new monaco.Range(
    //             data.codeEdit.range.startLineNumber,
    //             data.codeEdit.range.startColumn,
    //             data.codeEdit.range.endLineNumber,
    //             data.codeEdit.range.endColumn
    //           );
    //           // 실행할 작업(예: 텍스트 삽입)을 정의합니다.
    //           const editOperation = {
    //             range: range,
    //             text: data.codeEdit.text,
    //             forceMoveMarkers: true,
    //           };
    //           // 에디터 모델에 변경 사항을 적용합니다.
    //           model.pushEditOperations([], [editOperation], () => null);
    //           setIsApplyingServerChanges(false);
    //         }
    //       }
    //     }
    //   });
    // }
  }, [subscribe, projectId, stompClient]);

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
      return () => {
        provider.destroy();
        ydoc.destroy();
      };
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
