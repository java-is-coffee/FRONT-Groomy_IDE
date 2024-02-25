import { useState, useEffect, useCallback } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import { getTempToken } from "../api/auth/getTempToken";
import { CodeDetails } from "../redux/reducers/ide/editingCodeReducer";
import { toast } from "react-toastify";

interface UseYjsMonacoReturn {
  yDocs: YDocs;
  providers: Providers;
  isBindingEnd: boolean;
  bindEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

interface YDocs {
  [key: string]: Y.Doc;
}

interface Providers {
  [key: string]: WebsocketProvider;
}

interface Binding {
  [key: string]: MonacoBinding;
}

const useYjsMonaco = (
  projectId: string | undefined,
  curFile: CodeDetails
): UseYjsMonacoReturn => {
  const [yDocs, setYDocs] = useState<YDocs>({});
  const [providers, setProviders] = useState<Providers>({});
  const [isBindingEnd, setIsBindingEnd] = useState<boolean>(false);
  const [binding, setBinding] = useState<Binding>({});
  const fileId = curFile.id;

  const cleanUpProvider = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (providers[fileId]) {
        providers[fileId].on("status", (event: any) => {
          providers[fileId].destroy();
          if (event.status === "disconnected") {
            resolve();
          }
        });

        providers[fileId].disconnect();
      } else {
        resolve();
      }
    });
  }, [providers, fileId]); // 의존성 배열에 providers와 fileId를 포함합니다.

  useEffect(() => {
    console.log("ydoc 초기화....");
    const initializeYDoc = async () => {
      const tempToken = await getTempToken();
      if (!tempToken) {
        toast.error("접근 권한이 없습니다.");
        return;
      }
      setIsBindingEnd(false);
      // await cleanUpProvider();

      const yDocument = yDocs[curFile.id] || new Y.Doc();
      const wsProvider =
        providers[curFile.id] ||
        new WebsocketProvider(
          `ws://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/YJS/`,
          `${projectId}/${fileId}`,
          yDocument,
          { connect: false, params: { tempToken } }
        );
      wsProvider.connect();

      wsProvider.shouldConnect = false;

      // 개발시에 사용하는 yjs 상태 확인 log
      // wsProvider.on("status", (event: any) => {
      //   console.log(`WebSocket connection status: ${event.status}`);
      // });

      // wsProvider.on("sync", (isSynced: any) => {
      //   console.log(`Sync status: ${isSynced}`);
      // });

      // yDocument.on("update", (update, origin) => {
      //   console.log(fileId);
      //   console.log("Document was updated", update, origin);
      // });

      setYDocs((prev) => ({ ...prev, [curFile.id]: yDocument }));
      setProviders((prev) => ({ ...prev, [curFile.id]: wsProvider }));
      console.log("ydoc 초기화 완료");
    };

    initializeYDoc();

    return () => {
      console.log("ydoc 프로바이더 삭제...");
      cleanUpProvider();
      if (binding[fileId]) {
        binding[fileId].destroy();
      }
    };
  }, [
    projectId,
    fileId,
    curFile.id,
    providers,
    yDocs,
    binding,
    cleanUpProvider,
  ]);

  const bindEditor = (editor: monaco.editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    const awareness = providers[curFile.id].awareness;
    if (!yDocs[curFile.id] || !providers[curFile.id] || !model) return;
    const yText = yDocs[curFile.id].getText("monaco");
    if (binding[fileId]) {
      binding[fileId].destroy();
    }
    const newBinding = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      awareness
    );
    setBinding((prev) => ({ ...prev, [curFile.id]: newBinding }));
    setIsBindingEnd(true);
  };

  return { yDocs, providers, isBindingEnd, bindEditor };
};

export default useYjsMonaco;
