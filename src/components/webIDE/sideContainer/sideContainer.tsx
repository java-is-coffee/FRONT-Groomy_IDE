import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import IdeOptionType from "../../../enum/ideOptionType";
import Explorer from "./explorer";

import styles from "../../../styles/webIDE/sideContainer/sideContainer.module.css";
import Board from "./board";
import Chat from "./chat";

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
      default:
        return null;
    }
  };

  return <div className={styles["side-container-contents"]}>{renderContent()}</div>;
};

export default SideContainer;
