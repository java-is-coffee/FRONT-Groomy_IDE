import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Close } from "@mui/icons-material";
import getLanguageIcon from "./language";
import {
  CodeDetails,
  removeCodeTab,
  setCurEditingCode,
} from "../../../redux/reducers/ide/editingCodeReducer";

import editorStyles from "./codeEditor.module.css";

const CodeTab = () => {
  const dispatch = useDispatch();
  // redux 로부터 현재 탭과 탭에 대한 디테일 가져오기
  // 현재 탭
  const curTab = useSelector(
    (state: RootState) => state.editingCode.editingCode
  );
  // 탭 목록
  const tabDetails = useSelector(
    (state: RootState) => state.editingCode.codeTabs
  );
  // 선택한 탭 닫기
  const closeTab = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    event.stopPropagation(); // 버블링을 막기 위해 호출
    dispatch(removeCodeTab(id));
  };
  // 탭 클릭으로 전환
  const handleTabSelect = (code: CodeDetails) => {
    dispatch(setCurEditingCode(code));
  };
  return (
    <div className={editorStyles[`code-tab-container`]}>
      {tabDetails.map((tab) => {
        return (
          <div
            key={tab.id}
            className={`${editorStyles[`code-tab-items`]} ${
              tab.id === curTab.id ? editorStyles.active : ""
            }`}
            onClick={() => handleTabSelect(tab)}
          >
            {getLanguageIcon(tab.name.split(".")[1])}
            <span>{`${tab.name}`}</span>
            <div
              className={editorStyles[`tab-close`]}
              onClick={(event) => closeTab(event, tab.id)}
            >
              <Close />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CodeTab;
