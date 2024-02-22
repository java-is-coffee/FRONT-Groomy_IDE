import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import IdeOptionType from "../../enum/ideOptionType";
import Explorer from "./sideContainer/explorer";
import Board from "./sideContainer/board";
import Chat from "./sideContainer/chat";
import LiveShare from "./sideContainer/liveShare";

import ideStyles from "./ideSytles.module.css";

const SideContainer: React.FC = () => {
  const option = useSelector((state: RootState) => state.ideOption.option);

  const renderContent = (): JSX.Element | null => {
    switch (option) {
      case IdeOptionType.File:
        return <Explorer />;
      case IdeOptionType.Board:
        return <Board />;
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
