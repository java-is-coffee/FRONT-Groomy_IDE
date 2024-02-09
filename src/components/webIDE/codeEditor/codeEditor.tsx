import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import CodeTab from "./codeTab";

import "../../../styles/webIDE/codeContainer.css";
import { editor } from "monaco-editor";

interface EditorState {
  code: string;
}

enum EditorTheme {
  iplastic = "iplastic",
  slush = "slushAndProppies",
  tomorrow = "tomorrow",
  xcode = "xcode",
}

const CodeEditor = () => {
  const [theme, setTheme] = useState<EditorTheme>(EditorTheme.xcode);
  useEffect(() => {}, []);
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // 테마 정의
      fetch(`./theme/ide/${theme}.json`)
        .then((data) => data.json())
        .then((themeData) => {
          monaco.editor.defineTheme(`${theme}`, themeData);
          monaco.editor.setTheme(`${theme}`);
        });
    }
  }, [monaco]);
  return (
    <div className="code-container">
      <CodeTab />
      <Editor language="java" value="" />
    </div>
  );
};

export default CodeEditor;
