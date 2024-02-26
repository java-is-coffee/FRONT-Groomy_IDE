import { useState, useEffect } from "react";
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

  useEffect(() => {
    let tempToken = "";
    const fetchTempToken = async () => {
      const token = await getTempToken();
      if (token) {
        tempToken = token;
      } else {
        toast.error("접근 권한이 없습니다.");
      }
    };
    const initializeYDoc = () => {
      if (!tempToken || !projectId || !fileId) return;
      let isContentExist: boolean = false;
      if (yDocs[fileId]) {
        isContentExist = true;
      }
      const yDocument = yDocs[fileId] || new Y.Doc();
      if (!isContentExist) {
        yDocument.getText("monaco").insert(0, curFile.content);
      }
      const wsProvider = new WebsocketProvider(
        `ws://ec2-54-180-2-103.ap-northeast-2.compute.amazonaws.com:8080/YJS/`,
        `${projectId}/${fileId}`,
        yDocument,
        { connect: false, params: { tempToken } }
      );
      wsProvider.connect();
      wsProvider.shouldConnect = false;

      setYDocs((prev) => ({ ...prev, [fileId]: yDocument }));
      setProviders((prev) => ({ ...prev, [fileId]: wsProvider }));
    };

    fetchTempToken().then(initializeYDoc);

    return () => {
      // 청소 함수
      const provider = providers[fileId];
      if (provider) {
        provider.disconnect();
        provider.destroy();
      }

      const bindingInstance = binding[fileId];
      if (bindingInstance) {
        bindingInstance.destroy();
      }
    };
    // eslint-disable-next-line
  }, [projectId, curFile.id]);

  const bindEditor = (editor: monaco.editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    const awareness = providers[curFile.id].awareness;
    if (!yDocs[curFile.id] || !providers[curFile.id] || !model) return;
    const yText = yDocs[curFile.id].getText("monaco");
    if (binding[curFile.id]) {
      binding[curFile.id].destroy();
    }
    const newBinding = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      awareness
    );
    setBinding((prev) => ({ ...prev, [curFile.id]: newBinding }));
    setTimeout(() => {
      setIsBindingEnd(true);
    }, 1000);
  };

  return { yDocs, providers, isBindingEnd, bindEditor };
};

export default useYjsMonaco;
