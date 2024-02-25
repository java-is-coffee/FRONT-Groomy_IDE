import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import IdeOptionType from "../../enum/ideOptionType";
import Explorer from "./sideContainer/explorer";

import Chat from "./sideContainer/chat";
import LiveShare from "./sideContainer/liveShare";

import ideStyles from "./ideSytles.module.css";
import BoardContent from "../newBoard/board/boardContent";
import BoardWritePage from "../newBoard/board/newBoardContent";
import { setOption } from "../../redux/reducers/boardReducer";
import BoardOption from "../../enum/boardOptionType";
import BoardListContainer from "../newBoard/board/boardList";

const SideContainer: React.FC = () => {
  const option = useSelector((state: RootState) => state.ideOption.option);
  const dispatch = useDispatch();
  dispatch(setOption(BoardOption.IdePage));

  const renderContent = (): JSX.Element | null => {
    switch (option) {
      case IdeOptionType.File:
        return <Explorer />;
      case IdeOptionType.BoardList:
        return <BoardListContainer />;
      case IdeOptionType.BoardContent:
        return <BoardContent />;
      case IdeOptionType.BoardWrite:
        return <BoardWritePage />;
      case IdeOptionType.Chat:
        return <Chat />;
      case IdeOptionType.LiveShare:
        return <LiveShare />;
      default:
        return null;
    }
  };

  return (
    <div className={ideStyles[`side-container-contents`]}>
      {renderContent()}
    </div>
  );
};

export default SideContainer;
