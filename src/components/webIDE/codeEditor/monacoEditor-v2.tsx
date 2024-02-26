import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { useParams } from "react-router-dom";
import useWebSocket from "../../../hooks/useWebSocket";
import useContentWidget from "../../../hooks/useCotentWidget";
import {
  ISaveItem,
  postFileDetails,
} from "../../../api/codeFile/postFileDetails";

import editorStyles from "./codeEditor.module.css";
import { toast } from "react-toastify";
import useYjsMonaco from "../../../hooks/useYjsMonaco";

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

const MonacoEditorV2 = () => {
  // 기본 정보 가져오기
  const { projectId } = useParams();
  const curFile = useSelector(
    (state: RootState) => state.editingCode.editingCode
  );
  const member = useSelector((state: RootState) => state.member.member);

  // 웹소켓 커스텀 훅 사용
  const { stompClient, connect, subscribe, sendMessage } = useWebSocket();
  const { manageWidget } = useContentWidget();

  // yjs pair editing
  const monacoRef = useRef<Monaco>();
  const { yDocs, providers, isBindingEnd, bindEditor } = useYjsMonaco(
    projectId,
    curFile
  );
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor>();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setEditorInstance(editor);
    monacoRef.current = monaco;
    console.log(monaco.editor.getModels());
    const currentModelId = editor.getModel()?.id;
    monaco.editor.getModels().forEach((model) => {
      if (model.id !== currentModelId) {
        model.dispose();
      }
    });
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
    // eslint-disable-next-line
  }, [stompClient, projectId, curFile, editorInstance, member]);

  useEffect(() => {
    if (!editorInstance || !yDocs[curFile.id] || !providers[curFile.id]) return;
    bindEditor(editorInstance);
    // eslint-disable-next-line
  }, [editorInstance, curFile, yDocs[curFile.id], providers[curFile.id]]);

  // cmd + s || ctrl + s 입력시 저장 메서드 호출
  useEffect(() => {
    if (!editorInstance || !curFile || !projectId) {
      return;
    }
    const disposable = editorInstance.onKeyDown((e) => {
      if ((e.metaKey || e.ctrlKey) && e.keyCode === monaco.KeyCode.KeyS) {
        e.preventDefault();
        if (editorInstance) {
          const saveItem: ISaveItem = {
            projectId: projectId,
            fileName: curFile.name,
            filePath: curFile.path,
            content: editorInstance.getValue(),
            type: "FILE",
          };
          const saveFileToServer = async () => {
            try {
              const result = await postFileDetails(saveItem);
              if (result) {
                toast.success("저장완료");
              } else {
                toast.error("서버에 저장을 실패하였습니다.");
              }
            } catch (error) {
              toast.error("서버에 저장을 실패하였습니다.");
            }
          };

          saveFileToServer();
        }
      }
    });

    return () => disposable.dispose();
  }, [curFile, editorInstance, projectId]);

  return (
    <div className={editorStyles[`monaco-editor-container`]}>
      <div style={{ display: isBindingEnd ? "none" : "" }}>
        <div className={editorStyles[`code-edit-starter`]}>
          <img src="/icon/Logo.png" alt="logo..." />
          <span>Loading... Editor...</span>
          <span style={{ fontSize: "17px" }}>저장 : cmt + s | ctrl + s</span>
          <span style={{ fontSize: "17px" }}>찾기 : cmd + f | ctrl + s</span>
          <div className={editorStyles[`loader`]}></div>
        </div>
      </div>
      <div hidden={!isBindingEnd} className={editorStyles[`monaco-editor`]}>
        <Editor
          key={curFile.id}
          defaultValue={curFile.content}
          language={curFile.lang}
          onMount={handleEditorDidMount}
          className={editorStyles[`editor`]}
        />
      </div>
    </div>
  );
};

export default MonacoEditorV2;
