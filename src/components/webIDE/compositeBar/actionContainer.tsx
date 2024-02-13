import { VscFiles } from "react-icons/vsc";
import { GoCommentDiscussion } from "react-icons/go";
import { GiBlackBook } from "react-icons/gi";
import "../../../styles/webIDE/compositeBar.css";
import IdeOptionType from "../../../enum/ideOptionType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { setIdeOption } from "../../../redux/reducers/ide/ideOptionReducer";
import { toggleSideContainer } from "../../../redux/reducers/ide/ideSideContainerReducer";

const ActionContainer = () => {
  const dispatch = useDispatch();
  const selectedOption = useSelector(
    (state: RootState) => state.ideOption.option
  );
  const openSideContainer = useSelector(
    (state: RootState) => state.ideSideContainer.open
  );
  const changeOption = (event: React.MouseEvent<HTMLDivElement>) => {
    const optionId = event.currentTarget.id;
    if (selectedOption === optionId || !openSideContainer) {
      dispatchSideContainer();
    }
    // optionId에 따라 setSelectedOption 호출
    switch (optionId) {
      case "file":
        dispatchOptions(IdeOptionType.File);
        break;
      case "board":
        dispatchOptions(IdeOptionType.Board);
        break;
      case "chat":
        dispatchOptions(IdeOptionType.Chat);
        break;
      default:
        dispatchOptions(IdeOptionType.File);
    }
  };

  const dispatchSideContainer = () => {
    dispatch(toggleSideContainer());
  };

  const dispatchOptions = (option: IdeOptionType) => {
    dispatch(setIdeOption(option));
  };

  return (
    <div className="action-container">
      <div
        className={`action-option ${
          selectedOption === IdeOptionType.File ? "selected" : ""
        }`}
        id="file"
        onClick={changeOption}
      >
        <VscFiles size={"24px"} />
      </div>
      <div
        className={`action-option ${
          selectedOption === IdeOptionType.Board ? "selected" : ""
        }`}
        id="board"
        onClick={changeOption}
      >
        <GiBlackBook size={"24px"} />
      </div>
      <div
        className={`action-option ${
          selectedOption === IdeOptionType.Chat ? "selected" : ""
        }`}
        id="chat"
        onClick={changeOption}
      >
        <GoCommentDiscussion size={"24px"} />
      </div>
    </div>
  );
};

export default ActionContainer;