import { useRef } from "react";
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

// Monaco editor contentWidget 커스텀
// 유저 정보 보이는 위젯
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
    this.domNode.style.zIndex = "100"; // 다른 요소 위에 나타나도록 z-index 설정
    this.domNode.style.border = "1px solid #ccc";
    this.domNode.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
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

// 커서 위치 보여주는 커스텀 위젯
class CursorWidget implements monaco.editor.IContentWidget {
  private domNode: HTMLElement;

  constructor(private props: WidgetProps, color: string) {
    this.domNode = document.createElement("div");
    this.domNode.style.width = "2px"; // Typical cursor width
    this.domNode.style.height = "1em"; // Height to match the font size
    this.domNode.style.background = color; // Cursor color
    this.domNode.style.position = "absolute"; // Positioning must be absolute
    this.domNode.style.zIndex = "100"; // 다른 요소 위에 나타나도록 z-index 설정
  }

  getId(): string {
    return `overlay-cursor-${this.props.memberId}`;
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

// 유저 랜덤색상 부여 메서드
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
    // 위젯 생성된게 없는 경우 빈 위젯 생성
    if (!widgetsRef.current[widgetId]) {
      widgetsRef.current[widgetId] = {
        contentWidget: undefined,
        cursorWidget: undefined,
      };
    }

    const { contentWidget, cursorWidget } = widgetsRef.current[widgetId];
    // 랜덤 색상
    const color = getRandomColor();
    // 위젯이 undefine인 경우
    // 위젯 생성후 에디터 인스턴스에 적용
    if (!contentWidget || !cursorWidget) {
      const newUser = new ContentWidget(props, color);
      const newCursor = new CursorWidget(props, color);
      widgetsRef.current[widgetId].contentWidget = newUser;
      widgetsRef.current[widgetId].cursorWidget = newCursor;
      editorInstance.addContentWidget(newUser);
      editorInstance.addContentWidget(newCursor);
    } else {
      // 위젯이 있는 경우 원래 위젯 삭제
      editorInstance.removeContentWidget(contentWidget);
      editorInstance.removeContentWidget(cursorWidget); // Corrected to remove cursor widget
      // 원래 위젯 위치 업데이트 후
      contentWidget.updatePosition(props);
      cursorWidget.updatePosition(props);
      // 새로운 위젯 적용
      editorInstance.addContentWidget(contentWidget);
      editorInstance.addContentWidget(cursorWidget);
    }

    // 언마운트시에 위젯 삭제
    return () => {
      console.log(`Cleaning up widgets for ID: ${widgetId}`);
      const { contentWidget, cursorWidget } = widgetsRef.current[widgetId];

      if (contentWidget) {
        editorInstance.removeContentWidget(contentWidget);
        widgetsRef.current[widgetId].contentWidget = undefined;
      }

      if (cursorWidget) {
        editorInstance.removeContentWidget(cursorWidget);
        widgetsRef.current[widgetId].cursorWidget = undefined;
      }
    };
  };

  return { manageWidget };
};

export default useContentWidget;
