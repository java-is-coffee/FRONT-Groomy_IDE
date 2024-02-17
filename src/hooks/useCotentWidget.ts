import React, { useCallback, useRef } from "react";
import * as monaco from "monaco-editor";

interface WidgetProps {
  memberId: number;
  codeEdit: {
    memberName: string;
    range: {
      startLineNumber: number;
      startColumn: number;
      endLineNumber: number;
      endColumn: number;
    };
    text: string;
  };
}

class ContentWidget implements monaco.editor.IContentWidget {
  private domNode: HTMLElement;

  constructor(private props: WidgetProps, color: string) {
    this.domNode = document.createElement("div");
    this.domNode.innerHTML = props.codeEdit.memberName;
    this.domNode.style.background = color;
    this.domNode.style.fontSize = "10px";
    this.domNode.style.padding = "2px 6px";
    this.domNode.style.borderRadius = "4px";
    this.domNode.style.whiteSpace = "nowrap";
    this.domNode.style.border = "1px solid #ccc";
    this.domNode.style.animation = "fadeInOut 1s ease-in-out forwards";
  }

  getId(): string {
    return `overlay-member-${this.props.memberId}`;
  }

  getDomNode(): HTMLElement {
    return this.domNode;
  }

  getPosition(): monaco.editor.IContentWidgetPosition {
    return {
      position: {
        lineNumber: this.props.codeEdit.range.startLineNumber,
        column: this.props.codeEdit.range.startColumn,
      },
      preference: [
        //monaco.editor.ContentWidgetPositionPreference.EXACT,
        monaco.editor.ContentWidgetPositionPreference.ABOVE,
        monaco.editor.ContentWidgetPositionPreference.BELOW,
      ],
    };
  }

  updatePosition(props: WidgetProps): void {
    // 요소 위치를 업데이트합니다.
    this.props = props; // 새로운 props로 위치 정보 업데이트
    // fadeIn 애니메이션이 끝난 후 fadeOut 애니메이션 적용
    this.domNode.addEventListener(
      "animationend",
      () => {
        this.domNode.style.animation = "fadeInOut 1s ease-in-out forwards";
      },
      { once: true }
    );
  }
}

class CursorWidget implements monaco.editor.IContentWidget {
  private domNode: HTMLElement;

  constructor(private props: WidgetProps, color: string) {
    this.domNode = document.createElement("div");
    this.domNode.style.width = "2px"; // Typical cursor width
    this.domNode.style.height = "1em"; // Height to match the font size
    this.domNode.style.background = color; // Cursor color
    this.domNode.style.position = "absolute"; // Positioning must be absolute
    this.domNode.style.whiteSpace = "nowrap";
  }

  getId(): string {
    return `overlay-user-${this.props.memberId}`;
  }

  getDomNode(): HTMLElement {
    return this.domNode;
  }

  getPosition(): monaco.editor.IContentWidgetPosition {
    return {
      position: {
        lineNumber: this.props.codeEdit.range.startLineNumber,
        column: this.props.codeEdit.range.startColumn,
      },
      preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
    };
  }

  updatePosition(props: WidgetProps): void {
    this.props = props; // 새로운 props로 위치 정보 업데이트
  }
}

const getRandomColor = (): string => {
  let color = "#";
  for (let i = 0; i < 3; i++) {
    // 128 ~ 255 사이의 값을 생성
    const value = Math.floor(Math.random() * 128) + 128;
    // 값을 16진수로 변환하고 결과 문자열에 추가
    color += value.toString(16).padStart(2, "0");
  }
  return color;
};

interface useWidget {
  contentWidget?: ContentWidget;
  cursorWidget?: CursorWidget;
}

interface WidgetsMap {
  [key: string]: useWidget;
}

const useContentWidget = () => {
  const widgetsRef = useRef<WidgetsMap>({});
  // /const widgetsRef = useRef<WidgetsMap>({});

  const manageWidget = (
    editorInstance: monaco.editor.IStandaloneCodeEditor,
    props: WidgetProps
  ) => {
    const widgetId: string = `${props.memberId}`;
    if (!widgetsRef.current[widgetId]) {
      widgetsRef.current[widgetId] = {
        contentWidget: undefined,
        cursorWidget: undefined,
      };
    }
    const userNameWidget = widgetsRef.current[widgetId].contentWidget;
    const curSorWidget = widgetsRef.current[widgetId].cursorWidget;
    const color = getRandomColor();
    if (!userNameWidget || !curSorWidget) {
      // 위젯 인스턴스가 존재하지 않으면 새로 생성합니다.
      const newUser = new ContentWidget(props, color);
      const newCursor = new CursorWidget(props, color);
      widgetsRef.current[widgetId].contentWidget = newUser;
      widgetsRef.current[widgetId].cursorWidget = newCursor;
      editorInstance.addContentWidget(newUser);
      editorInstance.addContentWidget(newCursor);
    } else {
      userNameWidget.updatePosition(props);
      curSorWidget.updatePosition(props);
      editorInstance.layoutContentWidget(userNameWidget);
      editorInstance.layoutContentWidget(curSorWidget);
    }

    return () => {
      // 위젯을 제거합니다.
      if (userNameWidget && curSorWidget) {
        userNameWidget.updatePosition(props);
        curSorWidget.updatePosition(props);
        editorInstance.layoutContentWidget(userNameWidget);
        editorInstance.layoutContentWidget(curSorWidget);
      }
    };
  };

  return { manageWidget };
};

export default useContentWidget;
