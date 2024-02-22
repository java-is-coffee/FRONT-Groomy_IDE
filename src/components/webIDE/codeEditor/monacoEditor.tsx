import { Editor, OnMount } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { useEffect, useState } from "react";
import { getTempToken } from "../../../api/auth/getTempToken";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import * as monaco from "monaco-editor";
import { useParams } from "react-router-dom";
import useWebSocket from "../../../hooks/useWebSocket";
import useContentWidget from "../../../hooks/useCotentWidget";
import {
  ISaveItem,
  postFileDetails,
} from "../../../api/codeFile/postFileDetails";

import editorStyles from "./codeEditor.module.css";

// 웹소켓 통신 DTO
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

const MonacoEditor = () => {
  // 기본 정보 가져오기
  const { projectId } = useParams();
  const curFile = useSelector(
    (state: RootState) => state.editingCode.editingCode
  );
  const member = useSelector((state: RootState) => state.member.member);

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);

  // 웹소켓 커스텀 훅 사용
  const { stompClient, connect, subscribe, sendMessage } = useWebSocket();
  const { manageWidget } = useContentWidget();

  // yjs pair editing
  const [tempToken, setTempToken] = useState<string>("");
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  // cmd + s || ctrl + s 입력시 저장 메서드 호출
  useEffect(() => {
    if (editorInstance && curFile && projectId) {
      const disposable = editorInstance.onKeyDown((e) => {
        if ((e.metaKey || e.ctrlKey) && e.keyCode === monaco.KeyCode.KeyS) {
          e.preventDefault();
          const saveItem: ISaveItem = {
            projectId: projectId,
            fileName: curFile.name,
            filePath: curFile.path,
            content: editorInstance.getValue(),
            type: "FILE",
          };
          console.log("save");
          const saveFileToServer = async () => {
            try {
              const result = await postFileDetails(saveItem);
              if (result) {
                console.log("저장 성공");
              } else {
                console.log("서버에 저장을 실패하였습니다.");
              }
            } catch (error) {
              console.log("서버에 저장을 실패하였습니다.");
            }
          };

          saveFileToServer();
        }
      });

      return () => disposable.dispose();
    }
  }, [curFile, editorInstance, projectId]);

  useEffect(() => {
    // 임시 토큰을 한 번만 가져옵니다.
    const fetchTempToken = async () => {
      const token = await getTempToken();
      if (token) {
        setTempToken(token);
      }
    };
    fetchTempToken();
    return () => {
      setIsLoading(true);
    };
  }, [projectId, curFile.id]);

  // Y.js 문서 및 WebSocket 프로바이더 설정
  useEffect(() => {
    if (!tempToken || !projectId || !curFile.id) return;

    const yDocument = new Y.Doc();
    const yText = yDocument.getText("monaco");
    yText.insert(0, curFile.content);

    const wsProvider = new WebsocketProvider(
      `ws://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/YJS/`,
      `${projectId}/${curFile.id}`,
      yDocument,
      { params: { tempToken } }
    );

    // 개발시에 사용하는 yjs 상태 확인 log
    // wsProvider.on("status", (event: any) => {
    //   console.log(`WebSocket connection status: ${event.status}`);
    // });

    // wsProvider.on("sync", (isSynced: any) => {
    //   console.log(`Sync status: ${isSynced}`);
    // });

    // yDocument.on("update", (update, origin) => {
    //   console.log("Document was updated", update, origin);
    // });

    setYDoc(yDocument);
    setProvider(wsProvider);

    return () => {
      wsProvider.disconnect();
      wsProvider.destroy();
      yDocument.destroy();
    };
  }, [tempToken, projectId, curFile, editorInstance]);

  // 프로바이더 ydoc 설정을 editorInstance에 바인딩
  useEffect(() => {
    if (!yDoc || !provider || !editorInstance) return;

    const model = editorInstance.getModel();
    if (!model) return;

    const yText = yDoc.getText("monaco");
    new MonacoBinding(
      yText,
      model,
      new Set([editorInstance]),
      provider.awareness
    );

    // ydoc 수정점 옵저빙 log
    // yText.observe((event: any) => {
    //   console.log("Y.js document was updated:", event);
    // });

    console.log("Y.js and Monaco Editor are now bound together");
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [tempToken, yDoc, provider, editorInstance]);

  // 커서 변경 이벤트 핸들러 추가 & 변경시 웹소켓으로 메세지 전송
  const handleEditorDidMount: OnMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    setEditorInstance(editor);
    console.log("editor mount" + editor.getValue());
    if (editor && curFile.id) {
      editor.onDidChangeCursorPosition((e) => {
        const position = e.position;
        if (member?.memberId) {
          const message: CodeDTO = {
            action: "CURSOR",
            fileId: curFile.id,
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
    }
  };

  // code 주소 구독(cursor & user Widget) 메세지 적용
  useEffect(() => {
    if (!stompClient) {
      connect("ws/project");
    }

    if (!curFile || !editorInstance) {
      return;
    }
    const subDestination = `/projectws/${projectId}/code`;

    subscribe(subDestination, (message) => {
      // 메시지에 대한 처리 로직
      if (curFile && member) {
        const data: CodeDTO = JSON.parse(message.body);
        if (data.memberId !== member?.memberId && data.action === "CURSOR") {
          if (editorInstance && data.fileId === curFile.id) {
            manageWidget(editorInstance, {
              memberId: data.memberId,
              codeEdit: data.codeEdit,
            });
          }
        }
      }
    });
  }, [
    stompClient,
    projectId,
    curFile,
    editorInstance,
    connect,
    manageWidget,
    member,
    subscribe,
  ]);

  return (
    <div className={editorStyles[`monaco-editor-container`]}>
      <div style={{ display: isLoading ? "" : "none" }}>
        <div className={editorStyles[`code-edit-starter`]}>
          <img src="/icon/Logo.png" alt="logo..." />
          <span>Loading... Editor...</span>
          <div className={editorStyles[`loader`]}></div>
        </div>
      </div>
      <div hidden={isLoading} className={editorStyles[`monaco-editor`]}>
        <Editor
          key={curFile.id}
          language={curFile.lang}
          value={curFile.content}
          onMount={handleEditorDidMount}
          className={editorStyles[`editor`]}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
