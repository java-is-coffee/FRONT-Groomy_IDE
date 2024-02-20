import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import IdeOptionType from "../../../enum/ideOptionType";
import Explorer from "./explorer";

import "../../../styles/webIDE/sideContainer/sideContainer.css";
import Board from "./board";
import Chat from "./chat";
import LiveShare from "./liveShare";

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

  return <div className="side-container-contents">{renderContent()}</div>;
};

export default SideContainer;
